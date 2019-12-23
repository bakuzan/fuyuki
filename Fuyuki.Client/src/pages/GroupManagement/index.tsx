import * as React from 'react';
import { Helmet } from 'react-helmet';

import Groups from 'src/components/Groups';

function GroupManagement(props: any) {
  console.log('GM', props);

  return (
    <div className="page">
      <Helmet title="Groups" />
      <h2 className="page__title">Groups</h2>
      <div>
        <Groups endpoint={'group/getall'} />
      </div>
    </div>
  );
}

export default GroupManagement;
