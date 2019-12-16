import * as React from "react";

import { useAsync } from "../hooks/useAsync";
import GroupItem from "./GroupItem";

interface Group {
  id: number;
  name: string;
}

function GroupList() {
  const [id, setId] = React.useState(0);

  const state = useAsync<Group[]>(async () => {
    const response = await fetch("group/getall");
    const result = await response.json();
    return result;
  });

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
              state.value.map(x => (
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
      {id && <GroupItem id={id} />}
    </div>
  );
}

export default GroupList;
