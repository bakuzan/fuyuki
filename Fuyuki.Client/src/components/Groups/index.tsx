import classNames from 'classnames';
import React, { useState } from 'react';

import ClearableInput from 'meiko/ClearableInput';
import Grid from 'meiko/Grid';
import LoadingBouncer from 'meiko/LoadingBouncer';
import RequestMessage from '../RequestMessage';
import GroupItem from './GroupItem';

import { useAsync } from 'src/hooks/useAsync';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { GroupWithSubreddits } from 'src/interfaces/Group';
import guardList from 'src/utils/guardList';
import sendRequest from 'src/utils/sendRequest';
import applyGroupFilter from './applyGroupFilter';

import './Groups.scss';

interface GroupsProps {
  endpoint: string;
  enableFilter?: boolean;
}

function Groups(props: GroupsProps) {
  const { endpoint, enableFilter = false } = props;
  const [filter, setFilter] = useState('');

  const state = useAsync<FykResponse<GroupWithSubreddits[]>>(
    async () => await sendRequest(endpoint),
    [endpoint]
  );

  if (state.loading) {
    return <LoadingBouncer />;
  }

  const badResponse = state.value as ApiResponse;
  if (state.error || badResponse?.error) {
    return <RequestMessage text="Failed to fetch groups" />;
  }

  const items = guardList(state);
  const filteredItems = enableFilter ? applyGroupFilter(items, filter) : items;
  const hasFilter = filter.length > 0;
  const noSubsMessage = hasFilter
    ? 'No subreddits for the current filter.'
    : undefined;
  console.log('GROUPS', filteredItems);
  return (
    <div className="groups-widget">
      {enableFilter && (
        <ClearableInput
          id="filter"
          name="filter"
          value={filter}
          label="Filter on group and subreddit"
          aria-label="Enter text to filter on group name and/or subreddit name"
          onKeyPress={(e) => e.stopPropagation()}
          onChange={(e) => {
            const el = e.target as HTMLInputElement;
            setFilter(el.value);
          }}
        />
      )}

      <Grid
        className={classNames('groups', {
          'groups--empty': filteredItems.length === 0
        })}
        items={filteredItems}
        noItemsText={
          !hasFilter
            ? 'No groups available'
            : 'No groups or subreddits for current filter'
        }
      >
        {(x: GroupWithSubreddits) => (
          <GroupItem
            key={x.id}
            data={x}
            filtered={hasFilter}
            noSubredditsMessage={noSubsMessage}
          />
        )}
      </Grid>
    </div>
  );
}

export default Groups;
