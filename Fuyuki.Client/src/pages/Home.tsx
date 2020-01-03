import * as React from 'react';
import { Helmet } from 'react-helmet';

import Groups from 'src/components/Groups';
import { PageProps } from 'src/interfaces/PageProps';

function Home(props: PageProps) {
  console.log('Home', props);

  return (
    <div className="page">
      <Helmet title="Home" />
      <section>
        <header className="page__header">
          <h2 className="page__title">Home</h2>
        </header>
        <div>
          <Groups endpoint={'group/getallwithsubreddits'} />
        </div>
      </section>
    </div>
  );
}

export default Home;
