import React, { useEffect, useState } from 'react';

import ClearableInput from 'meiko/ClearableInput';
import List from 'meiko/List';

import { useDebounce } from 'meiko/hooks/useDebounce';
import { usePrevious } from 'meiko/hooks/usePrevious';
import LoadingBouncer from 'meiko/LoadingBouncer';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import sendRequest from 'src/utils/sendRequest';
import FYKLink from '../FYKLink';
import RequestMessage from '../RequestMessage';

interface Subreddit {
  id: string;
  name: string;
}

interface SubredditWidgetProps {}

function SubredditWidget(props: SubredditWidgetProps) {
  const [searchText, setSearchText] = useState('');

  const debouncedSearchTerm = useDebounce(searchText, 750);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  const [state, fetchSubreddits] = useAsyncFn<FykResponse<Subreddit[]>, any>(
    async (searchTerm: string) =>
      await sendRequest(`/Reddit/Subreddit/search?searchText=${searchTerm}`)
  );

  const loading = state.loading;
  useEffect(() => {
    const newSearchTerm = debouncedSearchTerm !== prevSearchTerm;

    if (debouncedSearchTerm && newSearchTerm && !loading) {
      fetchSubreddits(debouncedSearchTerm);
    }
  }, [loading, prevSearchTerm, debouncedSearchTerm, fetchSubreddits]);

  const badResponse = state.value as ApiResponse;
  const hasError = state.error || badResponse?.error;
  const subredditResults = hasError
    ? []
    : ((state.value ? state.value : []) as Subreddit[]);

  return (
    <section className="subreddit-widget">
      <header>
        <h3 className="subreddit-widget__title">Search for subreddits</h3>
      </header>
      <div>
        <ClearableInput
          id="searchSubreddits"
          label="Filter on name"
          value={searchText}
          onChange={(event) => {
            const element = event.target as HTMLInputElement;
            setSearchText(element.value);
          }}
        />
        {loading && <LoadingBouncer />}
        {hasError && <RequestMessage text={'Failed to fetch subreddits'} />}
        {!loading && (
          <List className="subreddit-widget__results" columns={1}>
            {subredditResults.map((x) => {
              return (
                <li key={x.id} className="subreddit-widget__result">
                  <FYKLink
                    className="subreddit-widget__subreddit"
                    to={`/r/${x.name}`}
                  >
                    r/{x.name}
                  </FYKLink>
                </li>
              );
            })}
          </List>
        )}
      </div>
    </section>
  );
}

export default SubredditWidget;
