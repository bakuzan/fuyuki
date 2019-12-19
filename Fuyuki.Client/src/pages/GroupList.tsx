import * as React from 'react';

import { useAsync } from '../hooks/useAsync';
import GroupItem, { Group } from '../components/GroupItem';
import sendRequest from '../utils/sendRequest';

function GroupList() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [id, setId] = React.useState(0);

  const state = useAsync<Group[]>(async () => {
    return await sendRequest('group/getall');
  }, [refreshKey]);

  async function onSubmit(item: Group) {
    const result = await sendRequest('group', {
      method: 'PUT',
      body: JSON.stringify(item)
    });

    if (result.success) {
      setRefreshKey((p) => p + 1);
    }
  }

  return (
    <div>
      <h2>Groups</h2>
      <div>
        {state.loading ? (
          <div>Loading...</div>
        ) : state.error ? (
          <div>Failed to fetch groups</div>
        ) : (
          <ul>
            {state.value &&
              state.value.map((x) => (
                <li key={x.id}>
                  {x.name}
                  <button type="button" onClick={() => setId(x.id)}>
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
      {id && <GroupItem id={id} onSubmit={onSubmit} />}
    </div>
  );
}

export default GroupList;
