import React, { useEffect, useState } from 'react';

import ClearableInput from 'meiko/ClearableInput';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import RadioButton, { RadioButtonProps } from 'meiko/RadioButton';

import { EventCodes } from 'meiko/constants/enums';
import { useDebounce } from 'meiko/hooks/useDebounce';
import { useFocusShortcut } from 'meiko/hooks/useFocusShortcut';
import { usePrevious } from 'meiko/hooks/usePrevious';

import RequestMessage from 'src/components/RequestMessage';
import Widget, { WidgetProps, WidgetToggleZone } from 'src/components/Widget';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { SearchResult } from 'src/interfaces/SearchResult';
import sendRequest from 'src/utils/sendRequest';

import './SearchWidget.scss';

interface SearchWidgetProps
  extends Pick<WidgetProps, 'isExpanded' | 'isLocked' | 'setExpanded'> {
  endpoint: string;
  isSortable?: boolean;
  itemName: string;
  renderContent: React.FunctionComponent<{ data: SearchResult }>;
}

enum SearchSort {
  New = 1,
  Relevance = 2
}

const sortOptions: RadioButtonProps[] = [
  { id: 'newSort', label: 'New', value: SearchSort.New },
  { id: 'relevanceSort', label: 'Relevance', value: SearchSort.Relevance }
];

const TOGGLE_ZONE_ID = 'search-toggle';

export const SearchWidgetToggleZone = () => (
  <WidgetToggleZone id={TOGGLE_ZONE_ID} />
);

function SearchWidget(props: SearchWidgetProps) {
  const {
    endpoint,
    isSortable = false,
    itemName,
    renderContent: ItemContent,
    ...wProps
  } = props;

  const [searchText, setSearchText] = useState('');
  const [sort, setSort] = useState(SearchSort.Relevance);

  const focusRef = useFocusShortcut(EventCodes.KeyS);

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
    <Widget
      className="search-widget"
      name="search"
      title={`Search for ${itemName}s`}
      firstId="searchWidgetInput"
      lastId={lastId}
      toggleZoneId={TOGGLE_ZONE_ID}
      exceptionClasses={['search-widget__search-clear']}
      {...wProps}
    >
      <div>
        <ClearableInput
          ref={focusRef}
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
    </Widget>
  );
}

export default SearchWidget;
