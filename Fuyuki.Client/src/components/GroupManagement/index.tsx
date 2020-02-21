import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import AutocompleteInput from 'meiko/AutocompleteInput';
import { Button } from 'meiko/Button';
import Icons from 'meiko/constants/icons';
import FC from 'meiko/FormControls';
import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import { CSSLikeObject } from 'meiko/styles/CSSLikeObject';
import tagChipStyle from 'meiko/styles/TagChip';

import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { FykResponse } from 'src/interfaces/ApiResponse';
import { GroupWithSubreddits } from 'src/interfaces/Group';
import { SearchResult } from 'src/interfaces/SearchResult';
import { Subreddit } from 'src/interfaces/Subreddit';
import alertService from 'src/utils/alertService';
import guardList from 'src/utils/guardList';
import sendRequest from 'src/utils/sendRequest';

import './GroupManagement.scss';

const tagStyle = tagChipStyle as CSSLikeObject;

interface GroupManagementProps {
  data: GroupWithSubreddits;
  onSubmitSuccess(payload: GroupWithSubreddits): void;
  onDeleteSuccess?(): void;
  onCancel(): void;
}

function GroupManagement(props: GroupManagementProps) {
  const { data, onDeleteSuccess } = props;
  const isEdit = data.id !== 0;
  const canDelete = isEdit && onDeleteSuccess;

  const [searchString, setSearchString] = useState('');
  const [state, setState] = useState<GroupWithSubreddits>(data);

  const [subState, fetchSubreddits] = useAsyncFn<
    FykResponse<SearchResult[]>,
    any
  >(
    async (searchTerm: string) =>
      await sendRequest(`/Reddit/Subreddit/search?searchText=${searchTerm}`)
  );

  const item = state as GroupWithSubreddits;
  const subreddits: SearchResult[] = guardList(subState);

  const debouncedSearchTerm = useDebounce(searchString, 500);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);
  const subloading = subState.loading;

  useEffect(() => {
    const newSearchTerm = debouncedSearchTerm !== prevSearchTerm;

    if (debouncedSearchTerm && newSearchTerm && !subloading) {
      fetchSubreddits(debouncedSearchTerm);
    }
  }, [subloading, prevSearchTerm, debouncedSearchTerm, fetchSubreddits]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      ...item,
      subreddits: item.subreddits.map((x) => ({
        ...x,
        id: Math.max(x.id, 0)
      }))
    };

    const result = await sendRequest(`group`, {
      body: JSON.stringify(payload),
      method: isEdit ? 'PUT' : 'POST'
    });

    if (result.success) {
      props.onSubmitSuccess(payload);
    } else {
      alertService.showError(
        result.errorMessages[0],
        `Failed to save Group(Name: ${item.name})`
      );
    }
  }

  async function onDelete() {
    const result = await sendRequest(`group/${item.id}`, {
      method: 'DELETE'
    });

    if (result.success && onDeleteSuccess) {
      onDeleteSuccess();
    } else {
      alertService.showError(
        result.errorMessages[0],
        `Failed to delete Group(Name: ${item.name})`
      );
    }
  }

  return (
    <div>
      <form id="groupForm" className="form" noValidate onSubmit={onSubmit}>
        <FC.ClearableInput
          id="name"
          name="name"
          label="Name"
          value={item.name}
          onChange={(e) => {
            const inp = e.target as HTMLInputElement;

            setState((p: GroupWithSubreddits | null) => {
              if (p === null) {
                return {} as GroupWithSubreddits;
              }

              return { ...p, name: inp.value };
            });
          }}
          clearButtonProps={{
            className: 'form-name-clear',
            id: 'formNameClear'
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
            const sub = subreddits.find((x) => x.id === itemId);
            if (!sub) {
              return;
            }

            setState((p: GroupWithSubreddits) => {
              const id = -p.subreddits.filter((x) => x.id < 0).length - 1;
              const name = sub.name.toLowerCase();
              const addedItem = { id, name };

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
                className={classNames('subreddits__item', tagStyle.tagChip)}
              >
                <div className={classNames(tagStyle.tagChip__text)}>
                  {x.name}
                </div>
                <Button
                  className={classNames(
                    'subreddits__remove',
                    tagStyle.tagChip__delete
                  )}
                  title={removeLabel}
                  aria-label={removeLabel}
                  icon={Icons.cross}
                  onClick={() => {
                    setState((p: GroupWithSubreddits) => ({
                      ...p,
                      subreddits: [
                        ...p.subreddits.filter((y: Subreddit) => y.id !== x.id)
                      ]
                    }));
                  }}
                />
              </li>
            );
          })}
        </List>

        <div className="form__buttons">
          <Button
            id="saveGroup"
            className="save-group-button"
            type="submit"
            btnStyle="primary"
          >
            Save
          </Button>
          <Button
            id="cancelGroup"
            className="cancel-group-button"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="button-group">
        {canDelete && (
          <Button
            id="deleteGroup"
            className="delete-button"
            onClick={() => onDelete()}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

export default GroupManagement;
