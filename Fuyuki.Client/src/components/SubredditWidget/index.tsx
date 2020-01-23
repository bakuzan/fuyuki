import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import Portal from 'meiko/Portal';
import TabTrap from 'meiko/TabTrap';

import { KeyCodes } from 'meiko/constants/enums';
import MkoIcons from 'meiko/constants/icons';
import { useDebounce } from 'meiko/hooks/useDebounce';
import { useOutsideClick } from 'meiko/hooks/useOutsideClick';
import { usePrevious } from 'meiko/hooks/usePrevious';

import FYKLink from '../FYKLink';
import RequestMessage from '../RequestMessage';

import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { RedditSubreddit } from 'src/interfaces/Subreddit';
import sendRequest from 'src/utils/sendRequest';

import './SubredditWidget.scss';

interface SubredditWidgetProps {
  isExpanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isLocked?: boolean;
}

const exceptionClasses = [
  'subreddit-widget-toggle',
  'subreddit-widget__search-clear'
];

function SubredditWidget(props: SubredditWidgetProps) {
  const { isExpanded, setExpanded, isLocked = false } = props;

  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLDivElement>;
  const [widgetId] = useState(generateUniqueId());
  const [searchText, setSearchText] = useState('');

  const isHidden = !isExpanded;
  const toggleBtnId = `toggle-${widgetId}`;

  useOutsideClick(ref.current, (e) => {
    const t = e.target;
    const isEscape = e.key === KeyCodes.escape;
    const noTarget = !t;
    const isNotException =
      t && !exceptionClasses.some((s) => t.className.includes(s));

    if (noTarget || isEscape || isNotException) {
      setExpanded(false);
    }
  });

  const debouncedSearchTerm = useDebounce(searchText, 750);
  const prevSearchTerm = usePrevious(debouncedSearchTerm);

  const [state, fetchSubreddits] = useAsyncFn<
    FykResponse<RedditSubreddit[]>,
    any
  >(
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
    : ((state.value ? state.value : []) as RedditSubreddit[]);

  const lastItem = subredditResults[subredditResults.length - 1];
  const lastId = lastItem
    ? `subreddit-${lastItem.name}`
    : searchText
    ? 'searchSubredditsClear'
    : 'searchSubreddits';

  return (
    <TabTrap
      ref={ref}
      isActive={isExpanded && !isLocked}
      element="section"
      firstId="closeButton"
      lastId={lastId}
      onDeactivate={() => {
        // TODO, make mko Button forwardRef
        const target = document.getElementById(toggleBtnId);
        if (target) {
          target.focus();
        }
      }}
      aria-hidden={isHidden}
      className={classNames('subreddit-widget', {
        'subreddit-widget--hidden': isHidden
      })}
    >
      {!isLocked && (
        <Portal querySelector="#subreddit-toggle">
          <Button
            id={toggleBtnId}
            className="subreddit-widget-toggle"
            aria-label="Toggle subreddit search widget"
            title="Toggle subreddit search widget"
            icon={`\uD83D\uDD0D\uFE0E`}
            onClick={() => setExpanded((p) => !p)}
          />
        </Portal>
      )}
      <header className="subreddit-widget__header">
        {!isLocked && (
          <Button
            id="closeButton"
            className="subreddit-widget__close"
            btnStyle="primary"
            aria-label="Collapse subreddit widget"
            icon={MkoIcons.cross}
            onClick={() => setExpanded(false)}
          />
        )}
        <h3 className="subreddit-widget__title">Search for subreddits</h3>
      </header>
      <div>
        <ClearableInput
          id="searchSubreddits"
          label="Search subreddits"
          aria-label="Enter keywords to search for related subreddits"
          value={searchText}
          clearButtonProps={{
            btnStyle: 'primary',
            className: 'subreddit-widget__search-clear',
            id: 'searchSubredditsClear'
          }}
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
                    id={`subreddit-${x.name}`}
                    className="subreddit-widget__subreddit"
                    noShadow
                    to={`/r/posts/${x.name}`}
                  >
                    r/{x.name}
                  </FYKLink>
                </li>
              );
            })}
          </List>
        )}
      </div>
    </TabTrap>
  );
}

export default SubredditWidget;
