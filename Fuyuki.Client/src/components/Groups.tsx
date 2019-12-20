import * as React from 'react';

import List from 'meiko/List';
import FYKLink from './FYKLink';
import { useAsync } from '@/hooks/useAsync';
import { Group } from '@/interfaces/Group';
import sendRequest from '@/utils/sendRequest';

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

  return (
    <List>
      {state.value &&
        state.value.map((x: Group) => (
          <li key={x.id}>
            <FYKLink to={`group/${x.id}`}>{x.name}</FYKLink>
            {/* TODO */}
            {/* Show subreddits here, if it exists on x */}
          </li>
        ))}
    </List>
  );
}

export default Groups;
