import * as React from 'react';

import Groups from '@/components/Groups';

function GroupManagement(props: any) {
  console.log('GM', props);

  return (
    <div className="page">
      <h2>Groups</h2>
      <div>
        <Groups endpoint={'groups/getall'} />
      </div>
    </div>
  );
}

export default GroupManagement;
