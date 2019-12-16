import * as React from 'react';
import { useAsync } from '../hooks/useAsync';

interface Group {
  id: number;
  name: string;
}

interface GroupItemProps {
  id: number;
  onSubmit: (item: Group) => void;
}

function GroupItem({ id, onSubmit }: GroupItemProps) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(item);
  }

  return (
    <div>
      <form noValidate name="group" onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="id" value={item.id} />
        </div>
        <div>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={(e) => {
              const inp = e.target as HTMLInputElement;

              setState((p) => {
                if (p === null) {
                  return {} as Group;
                }

                return { ...p, name: inp.value };
              });
            }}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default GroupItem;
