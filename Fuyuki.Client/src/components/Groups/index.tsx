import * as React from 'react';

import List from 'meiko/List';
import FYKLink from '../FYKLink';
import { useAsync } from 'src/hooks/useAsync';
import { Group } from 'src/interfaces/Group';
import sendRequest from 'src/utils/sendRequest';

import './Groups.scss';

interface GroupsProps {
  endpoint: string;
}

function Groups(props: GroupsProps) {
  const { endpoint } = props;

  const state = useAsync<Group[]>(async () => await sendRequest(endpoint), [
    endpoint
  ]);

  console.log('GM', props, state);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Failed to fetch groups</div>;
  }

  const isSuccess = state.value && state.value instanceof Array;
  const items = isSuccess ? (state.value as Group[]) : [];
  const hasNoItems = items.length === 0;
  console.log('groups...', state, items);
  return (
    <List className="groups" shouldWrap>
      {hasNoItems && (
        <li key="NONE" className="groups__item groups__item--no-items">
          No groups available
        </li>
      )}
      {items.map((x: Group) => (
        <li key={x.id} className="groups__item">
          <FYKLink to={`group/${x.id}`}>{x.name}</FYKLink>
          {/* TODO */}
          {/* Show subreddits here, if it exists on x */}
        </li>
      ))}
    </List>
  );
}

export default Groups;
