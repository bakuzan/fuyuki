import * as React from 'react';

import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import RequestMessage from '../RequestMessage';
import GroupItem from './GroupItem';

import { useAsync } from 'src/hooks/useAsync';
import { ApiResponse } from 'src/interfaces/ApiResponse';
import { Group } from 'src/interfaces/Group';
import sendRequest from 'src/utils/sendRequest';

import './Groups.scss';

interface GroupsProps {
  endpoint: string;
}

function Groups(props: GroupsProps) {
  const { endpoint } = props;

  const state = useAsync<Group[] | ApiResponse>(
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

  const isSuccess = state.value && state.value instanceof Array;
  const items = isSuccess ? (state.value as Group[]) : [];
  const hasNoItems = items.length === 0;

  return (
    <List className="groups" shouldWrap>
      {hasNoItems && (
        <li key="NONE" className="groups__item groups__item--no-items">
          No groups available
        </li>
      )}
      {items.map((x: Group) => (
        <GroupItem key={x.id} data={x} />
      ))}
    </List>
  );
}

export default Groups;
