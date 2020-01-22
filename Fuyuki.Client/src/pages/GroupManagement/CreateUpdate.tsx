import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import AutocompleteInput from 'meiko/AutocompleteInput';
import { Button } from 'meiko/Button';
import Icons from 'meiko/constants/icons';
import FC from 'meiko/FormControls';
import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import tagChipStyle from 'meiko/styles/TagChip';

import { useAsync } from 'src/hooks/useAsync';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { FykResponse } from 'src/interfaces/ApiResponse';
import { Group } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import { RedditSubreddit, Subreddit } from 'src/interfaces/Subreddit';
import alertService from 'src/utils/alertService';
import guardList from 'src/utils/guardList';
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

  const [searchString, setSearchString] = useState('');
  const [state, setState] = useState<Group>(defaultGroup);
  const { loading, value } = useAsync<Group>(
    async () => (id ? await sendRequest(`group/${id}`) : Promise.resolve()),
    [id]
  );

  const grpSubState = useAsync<Subreddit[]>(
    async () => await sendRequest(`subreddit/getall`),
    []
  );

  const [subState, fetchSubreddits] = useAsyncFn<
    FykResponse<RedditSubreddit[]>,
    any
  >(
    async (searchTerm: string) =>
      await sendRequest(`/Reddit/Subreddit/search?searchText=${searchTerm}`)
  );

  const debouncedSearchTerm = useDebounce(searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  const subloading = subState.loading;
  useEffect(() => {
    const newSearchTerm = debouncedSearchTerm !== prevSearchTerm;

    if (debouncedSearchTerm && newSearchTerm && !subloading) {
      fetchSubreddits(debouncedSearchTerm);
    }
  }, [subloading, prevSearchTerm, debouncedSearchTerm, fetchSubreddits]);

  useEffect(() => {
    if (!loading && value) {
      setState(value);
    }
  }, [loading, value]);

  const item = state as Group;
  const isEdit = id > 0;
  const pageTitle = isEdit ? `Edit ${item.name}` : 'Create new group';

  const grpSubreddits: Subreddit[] = guardList(grpSubState);
  const subreddits: RedditSubreddit[] = guardList(subState);

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
      body: JSON.stringify(data),
      method: isEdit ? 'PUT' : 'POST'
    });

    if (result.success) {
      props.history.push('/groups');
    } else {
      alertService.showError(
        result.errorMessages[0],
        `Failed to save Group(Name: ${item.name})`
      );
    }
  }

  async function onDelete() {
    const result = await sendRequest(`group/${id}`, {
      method: 'DELETE'
    });

    if (result.success) {
      props.history.push('/groups');
    } else {
      alertService.showError(
        result.errorMessages[0],
        `Failed to delete Group(Name: ${item.name})`
      );
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
                return;
              }

              const subName = data.name.toLowerCase();
              const existing = grpSubreddits.find((x) => x.name === subName);

              setState((p: Group) => {
                const addedItem = existing ?? {
                  id: -p.subreddits.filter((x) => x.id < 0).length - 1,
                  name: subName
                };

                const items = [...p.subreddits, addedItem];
                const uniqueItems = items.filter(
                  (x, i, a) => a.findIndex((y) => y.name === x.name) === i
                );

                return { ...p, subreddits: uniqueItems };
              });

              setSearchString('');
            }}
            disableLocalFilter={true}
            noSuggestionsItem={
              subState.loading ? (
                <LoadingBouncer />
              ) : (
                <div>No matches found...</div>
              )
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
