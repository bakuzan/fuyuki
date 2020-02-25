import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import LoadingBouncer from 'meiko/LoadingBouncer';
import GroupManagement from 'src/components/GroupManagement';

import { useAsync } from 'src/hooks/useAsync';
import { GroupWithSubreddits } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

interface GroupManagementPageParams {
  id?: number;
}

const defaultGroup: GroupWithSubreddits = {
  id: 0,
  name: '',
  subreddits: []
};

function GroupManagementPage(props: PageProps<GroupManagementPageParams>) {
  const { id = 0 } = props.match.params;

  const [state, setState] = useState<GroupWithSubreddits | null>(null);
  const { loading, value } = useAsync<GroupWithSubreddits>(
    async () => (id ? await sendRequest(`group/${id}`) : Promise.resolve()),
    [id]
  );

  useEffect(() => {
    if (!loading) {
      setState(value ?? defaultGroup);
    }
  }, [loading, value]);

  const item = state as GroupWithSubreddits;
  const isEdit = id !== 0;
  const pageTitle = isEdit
    ? `Edit ${state?.name || 'Group'}`
    : 'Create new group';

  const returnToHome = () => props.history.push('/');

  return (
    <div className="page">
      <Helmet title={pageTitle} />
      {loading || !state ? (
        <LoadingBouncer />
      ) : (
        <section>
          <header className="page__header">
            <h2 className="page__title">{pageTitle}</h2>
          </header>
          <GroupManagement
            data={item}
            onSubmitSuccess={returnToHome}
            onDeleteSuccess={returnToHome}
            onCancel={returnToHome}
          />
        </section>
      )}
    </div>
  );
}

export default GroupManagementPage;
