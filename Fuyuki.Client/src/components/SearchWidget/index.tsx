import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import { Button } from 'meiko/Button';
import ClearableInput from 'meiko/ClearableInput';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import Portal from 'meiko/Portal';
import RadioButton, { RadioButtonProps } from 'meiko/RadioButton';
import TabTrap from 'meiko/TabTrap';

import { KeyCodes } from 'meiko/constants/enums';
import MkoIcons from 'meiko/constants/icons';
import { useDebounce } from 'meiko/hooks/useDebounce';
import { useOutsideClick } from 'meiko/hooks/useOutsideClick';
import { usePrevious } from 'meiko/hooks/usePrevious';

import RequestMessage from 'src/components/RequestMessage';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { SearchResult } from 'src/interfaces/SearchResult';
import sendRequest from 'src/utils/sendRequest';

import './SearchWidget.scss';

interface SearchWidgetProps {
  endpoint: string;
  isExpanded: boolean;
  isLocked?: boolean;
  isSortable?: boolean;
  itemName: string;
  renderContent: React.FunctionComponent<{ data: SearchResult }>;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

enum SearchSort {
  New = 1,
  Relevance = 2
}

const sortOptions: RadioButtonProps[] = [
  { id: 'newSort', label: 'New', value: SearchSort.New },
  { id: 'relevanceSort', label: 'Relevance', value: SearchSort.Relevance }
];

const exceptionClasses = [
  'search-widget-toggle',
  'search-widget__search-clear'
];

export const SearchWidgetToggleZone = () => (
  <div id="search-toggle" className="search-widget-toggle-zone"></div>
);

function SearchWidget(props: SearchWidgetProps) {
  const {
    endpoint,
    isExpanded,
    isLocked = false,
    isSortable = false,
    itemName,
    renderContent: ItemContent,
    setExpanded
  } = props;

  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLDivElement>;
  const [widgetId] = useState(generateUniqueId());
  const [searchText, setSearchText] = useState('');
  const [sort, setSort] = useState(SearchSort.Relevance);

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
  const prevSort = usePrevious(sort);

  const [state, fetchSearchResults, resetSearchResults] = useAsyncFn<
    FykResponse<SearchResult[]>,
    any
  >(
    async (searchTerm: string, sortNum: number) =>
      await sendRequest(
        `${endpoint}?searchText=${searchTerm}${
          isSortable ? `&sort=${sortNum}` : ''
        }`
      ),
    [endpoint, isSortable]
  );

  const loading = state.loading;

  useEffect(() => {
    const newSearchTerm = debouncedSearchTerm !== prevSearchTerm;
    const newSort = sort !== prevSort;
    const hasChange = newSearchTerm || newSort;

    if (debouncedSearchTerm && hasChange && !loading) {
      fetchSearchResults(debouncedSearchTerm, sort);
    } else if (!debouncedSearchTerm && newSearchTerm) {
      resetSearchResults();
    }
  }, [
    loading,
    prevSearchTerm,
    debouncedSearchTerm,
    sort,
    prevSort,
    fetchSearchResults,
    resetSearchResults
  ]);

  const badResponse = state.value as ApiResponse;
  const hasError = state.error || badResponse?.error;

  const searchResults = hasError
    ? []
    : ((state.value ? state.value : []) as SearchResult[]);

  const lastItem = searchResults[searchResults.length - 1];
  const lastId = lastItem
    ? `search-${lastItem.id}`
    : searchText
    ? 'searchWidgetClear'
    : 'searchWidgetInput';

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
      className={classNames('search-widget', {
        'search-widget--hidden': isHidden
      })}
    >
      {!isLocked && (
        <Portal querySelector="#search-toggle">
          <Button
            id={toggleBtnId}
            className="search-widget-toggle"
            aria-label={`Toggle ${itemName} search widget`}
            title={`Toggle ${itemName} search widget`}
            icon={`\uD83D\uDD0D\uFE0E`}
            onClick={() => setExpanded((p) => !p)}
          />
        </Portal>
      )}
      <header className="search-widget__header">
        {!isLocked && (
          <Button
            id="closeButton"
            className="search-widget__close"
            btnStyle="primary"
            aria-label={`Collapse ${itemName} search widget`}
            title={`Collapse ${itemName} search widget`}
            icon={MkoIcons.cross}
            onClick={() => setExpanded(false)}
          />
        )}
        <h3 className="search-widget__title">Search for {itemName}s</h3>
      </header>
      <div>
        <ClearableInput
          id="searchWidgetInput"
          label={`Search ${itemName}s`}
          aria-label={`Enter keywords to search for related ${itemName}s`}
          value={searchText}
          clearButtonProps={{
            btnStyle: 'primary',
            className: 'search-widget__search-clear',
            id: 'searchWidgetClear'
          }}
          onChange={(event) => {
            const element = event.target as HTMLInputElement;
            setSearchText(element.value);
          }}
        />
        {isSortable && (
          <div>
            <div className="search-widget__sort-label">Sort order</div>
            <div className="search-widget__sort-options">
              {sortOptions.map((x) => (
                <RadioButton
                  key={`${x.value}`}
                  {...x}
                  name="sort"
                  checked={x.value === sort}
                  onChange={() => setSort(x.value as SearchSort)}
                />
              ))}
            </div>
          </div>
        )}
        {loading && <LoadingBouncer />}
        {hasError && <RequestMessage text={`Failed to fetch ${itemName}s`} />}
        {!loading && (
          <List className="search-widget__results" columns={1}>
            {searchResults.map((x) => {
              return (
                <li key={x.id} className="search-widget__result">
                  <ItemContent data={x} />
                </li>
              );
            })}
          </List>
        )}
      </div>
    </TabTrap>
  );
}

export default SearchWidget;
