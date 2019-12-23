import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Icons from 'meiko/constants/icons';
import { Button } from 'meiko/Button';
import FC from 'meiko/FormControls';
import AutocompleteInput from 'meiko/AutocompleteInput';
import List from 'meiko/List';

import { useAsync } from 'src/hooks/useAsync';
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

function GroupCreateUpdate(props: RouteComponentProps) {
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
  const subreddits: Subreddit[] = subState.value || [];
  const pageTitle = id ? `Edit ${item.name}` : 'Create new group';

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

    const result = await sendRequest(`group`, {
      method: item.id ? 'PUT' : 'POST',
      body: JSON.stringify(item)
    });

    if (result.success) {
      props.history.push('/groups');
    } else {
      console.log('Failed', result);
      // TODO
      // Handle and display result.errorMessages...
    }
  }

  console.log('GM CU', props);

  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <h2 className="page__title">{pageTitle}</h2>
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
          onChange={(e) => setSearchString(e.target.value.toLocaleLowerCase())}
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
          noSuggestionsItem={
            <Button className="create-new-subreddit" onClick={handleCreateNew}>
              Add new subreddit
            </Button>
          }
        />
        <List className="subreddits">
          {item.subreddits.map((x: Subreddit) => (
            <li key={x.id} className="subreddits__item">
              <div>{x.name}</div>
              <Button
                className="subreddits__remove"
                icon={Icons.cross}
                onClick={() => {
                  setState((p: Group) => ({
                    ...p,
                    subreddits: [
                      ...p.subreddits.filter((y: Subreddit) => y.id !== x.id)
                    ]
                  }));
                }}
              />
            </li>
          ))}
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
    </div>
  );
}

export default GroupCreateUpdate;
