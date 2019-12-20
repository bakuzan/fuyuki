import * as React from 'react';

import { Button } from 'meiko/Button';
import FC from 'meiko/FormControls';
import { useAsync } from '@/hooks/useAsync';
import { Group } from '@/interfaces/Group';
import sendRequest from '@/utils/sendRequest';

function GroupCreateUpdate(props: any) {
  const id = 1;

  const [state, setState] = React.useState<Group | null>(null);
  const { loading, value } = useAsync<Group[]>(
    async () => await sendRequest(`group/${id}`),
    [id]
  );

  React.useEffect(() => {
    if (!loading && value) {
      setState(value);
    }
  }, [loading, value]);

  const item = state.value as Group;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await sendRequest(`group`, {
      method: item.id ? 'PUT' : 'POST',
      body: JSON.stringify(item)
    });

    if (result.success) {
      props.history.push('/groups');
    } else {
      console.log('Failed', result);
    }
  }

  console.log('GM CU', props);

  return (
    <div className="page">
      <h2>{item.name}</h2>
      <form className="form" name="group" noValidate onSubmit={onSubmit}>
        <FC.ClearableInput
          id="name"
          name="name"
          label="Name"
          value={item.name}
          onChange={(e) => {
            const inp = e.target as HTMLInputElement;

            setState((p: Group | null) => {
              if (p === null) {
                return {} as Group;
              }

              return { ...p, name: inp.value };
            });
          }}
        />

        {/* TODO */}
        {/* Ability to select subbreddits should go here */}

        <div className="form__buttons">
          <Button type="button" onClick={() => props.history.push('/groups')}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}

export default GroupCreateUpdate;
