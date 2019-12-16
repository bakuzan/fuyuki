import * as React from 'react';

import { useAsync } from '../hooks/useAsync';
import GroupItem from './GroupItem';

interface Group {
  id: number;
  name: string;
}

function GroupList() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [id, setId] = React.useState(0);

  const state = useAsync<Group[]>(async () => {
    const response = await fetch('group/getall');
    const result = await response.json();
    return result;
  }, [refreshKey]);

  async function onSubmit(item: Group) {
    try {
      const response = await fetch('group', {
        method: 'PUT',
        body: JSON.stringify(item)
      });

      const result = await response.json();

      if (result && result.success) {
        setRefreshKey((p) => p + 1);
      }
    } catch (e) {
      console.error(e);
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
