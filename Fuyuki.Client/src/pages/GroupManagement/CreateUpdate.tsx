import classNames from 'classnames';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import Icons from 'meiko/constants/icons';
import { Button } from 'meiko/Button';
import FC from 'meiko/FormControls';
import AutocompleteInput from 'meiko/AutocompleteInput';
import List from 'meiko/List';
import tagChipStyle from 'meiko/styles/TagChip';

import { useAsync } from 'src/hooks/useAsync';
import { PageProps } from 'src/interfaces/PageProps';
import { Group } from 'src/interfaces/Group';
import { Subreddit } from 'src/interfaces/Subreddit';
import sendRequest from 'src/utils/sendRequest';

import './CreateUpdate.scss';

interface GroupCreateUpdateParams {
  id?: number;
}

const defaultGroup: Group = {
  id: 0,
  name: '',
  subreddits: []
};

function GroupCreateUpdate(props: PageProps) {
  const { id = 0 } = props.match.params as GroupCreateUpdateParams;

  const [searchString, setSearchString] = React.useState('');
  const [state, setState] = React.useState<Group>(defaultGroup);
  const { loading, value } = useAsync<Group>(
    async () => (id ? await sendRequest(`group/${id}`) : Promise.resolve()),
    [id]
  );

  const subState = useAsync<Subreddit[]>(
    async () => await sendRequest(`subreddit/getall`),
    []
  );

  React.useEffect(() => {
    if (!loading && value) {
      setState(value);
    }
  }, [loading, value]);

  const item = state as Group;
  const isEdit = id > 0;
  const subreddits: Subreddit[] = subState.value || [];
  const pageTitle = isEdit ? `Edit ${item.name}` : 'Create new group';

  function handleCreateNew() {
    const data = {
      id: -item.subreddits.filter((x: Subreddit) => x.id < 0).length - 1,
      name: searchString
    };

    setState((p: Group) => ({
      ...p,
      subreddits: [...p.subreddits, data]
    }));

    setSearchString('');
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      ...item,
      subreddits: item.subreddits.map((x) => ({
        ...x,
        id: Math.max(x.id, 0)
      }))
    };

    const result = await sendRequest(`group`, {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(data)
    });

    if (result.success) {
      props.history.push('/groups');
    } else {
      console.log('Failed', result);
      // TODO
      // Handle and display result.errorMessages...
    }
  }

  async function onDelete() {
    const result = await sendRequest(`group/${id}`, {
      method: 'DELETE'
    });

    if (result.success) {
      props.history.push('/groups');
    } else {
      console.log('Failed', result);
      // TODO
      // Handle and display result.errorMessages...
    }
  }

  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <section>
        <header className="page__header">
          <h2 className="page__title">{pageTitle}</h2>
        </header>
        <form className="form" name="group" noValidate onSubmit={onSubmit}>
          <FC.ClearableInput
            id="name"
            name="name"
            label="Name"
            value={item.name}
            onChange={(e) => {
              const inp = e.target as HTMLInputElement;

              setState((p: Group | null) => {
                if (p === null) {
                  return {} as Group;
                }

                return { ...p, name: inp.value };
              });
            }}
          />

          <AutocompleteInput
            id="subreddit-entry"
            attr="name"
            filter={searchString}
            label="Subreddits"
            items={subreddits}
            onChange={(e) =>
              setSearchString(e.target.value.toLocaleLowerCase())
            }
            onSelect={(itemId) => {
              const data = subreddits.find((x) => x.id === itemId);
              if (!data) {
                return handleCreateNew();
              }

              setState((p: Group) => {
                const items = [...p.subreddits, data];
                const uniqueItems = items.filter(
                  (x, i, a) => a.findIndex((y) => y.name === x.name) === i
                );

                return { ...p, subreddits: uniqueItems };
              });

              setSearchString('');
            }}
            disableLocalFilter={subreddits.length === 0}
            noSuggestionsItem={
              <Button
                className="create-new-subreddit"
                onClick={handleCreateNew}
              >
                Add new subreddit
              </Button>
            }
          />
          <List className="subreddits" shouldWrap>
            {item.subreddits.map((x: Subreddit) => {
              const removeLabel = `Remove ${x.name}`;

              return (
                <li
                  key={x.id}
                  className={classNames(
                    'subreddits__item',
                    tagChipStyle.tagChip
                  )}
                >
                  <div className={classNames(tagChipStyle.tagChip__text)}>
                    {x.name}
                  </div>
                  <Button
                    className={classNames(
                      'subreddits__remove',
                      tagChipStyle.tagChip__delete
                    )}
                    title={removeLabel}
                    aria-label={removeLabel}
                    icon={Icons.cross}
                    onClick={() => {
                      setState((p: Group) => ({
                        ...p,
                        subreddits: [
                          ...p.subreddits.filter(
                            (y: Subreddit) => y.id !== x.id
                          )
                        ]
                      }));
                    }}
                  />
                </li>
              );
            })}
          </List>

          <div className="form__buttons">
            <Button type="submit" btnStyle="primary">
              Save
            </Button>
            <Button type="button" onClick={() => props.history.push('/groups')}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="button-group">
          {isEdit && (
            <Button className="delete-button" onClick={() => onDelete()}>
              Delete
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default GroupCreateUpdate;
