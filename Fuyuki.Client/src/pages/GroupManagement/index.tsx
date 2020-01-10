import * as React from 'react';
import { Helmet } from 'react-helmet';

import Groups from 'src/components/Groups';
import { LinkAsButton } from 'src/components/Buttons';

import { PageProps } from 'src/interfaces/PageProps';

function GroupManagement(props: PageProps) {
  return (
    <div className="page">
      <Helmet title="Groups" />
      <section>
        <header className="page__header">
          <h2 className="page__title">Groups</h2>
          <div>
            <LinkAsButton className="add-link" btnStyle="primary" to={`group/`}>
              Add new group
            </LinkAsButton>
          </div>
        </header>
        <div>
          <Groups endpoint={'group/getall'} />
        </div>
      </section>
    </div>
  );
}

export default GroupManagement;
