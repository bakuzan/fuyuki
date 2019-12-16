import * as React from 'react';
import { useAsync } from '../hooks/useAsync';

interface Group {
  id: number;
  name: string;
}

function GroupItem({ id }: { id: number }) {
  const { loading, value } = useAsync<Group>(async () => {
    const response = await fetch(`group/${id}`);
    const result = await response.json();
    return result;
  });

  const [state, setState] = React.useState<Group | null>(null);

  React.useEffect(() => {
    if (!loading && value) {
      setState(value);
    }
  }, [loading, value]);

  if (state === null) {
    return null;
  }
  console.log(state);
  const item = state as Group;

  return (
    <div>
      <form noValidate name="group" action="group" method="PUT">
        <div>
          <input type="hidden" name="id" value={item.id} />
        </div>
        <div>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={(e) =>
              setState((p) => {
                if (p === null) {
                  return {} as Group;
                }
                console.log('event', p, e.target.value);
                return { ...p, name: e.target.value };
              })
            }
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default GroupItem;
