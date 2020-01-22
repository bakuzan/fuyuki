import React from 'react';
import { Helmet } from 'react-helmet';

import Groups from 'src/components/Groups';
import SubredditWidget from 'src/components/SubredditWidget';
import { PageProps } from 'src/interfaces/PageProps';

import './Home.scss';

function Home(props: PageProps) {
  return (
    <div className="page page--row">
      <Helmet title="Home" />
      <section className="home">
        <header className="page__header">
          <h2 className="page__title">Home</h2>
        </header>

        <Groups enableFilter endpoint={'group/getallwithsubreddits'} />
      </section>
      <SubredditWidget />
    </div>
  );
}

export default Home;
