import classNames from 'classnames';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import { useWindowSize } from 'meiko/hooks/useWindowSize';

import Groups from 'src/components/Groups';
import SubredditWidget from 'src/components/SubredditWidget';
import { PageProps } from 'src/interfaces/PageProps';
import { isXS } from 'src/utils/media';

import './Home.scss';

function Home(props: PageProps) {
  const [expanded, setExpanded] = useState(false);

  const size = useWindowSize();
  const notASmallWindow = !isXS(size.width);
  const isExpanded = notASmallWindow || expanded;

  return (
    <div className="page page--row">
      <Helmet title="Home" />
      <section className={classNames('home', { 'home--margin': isExpanded })}>
        <header className="page__header">
          <h2 className="page__title">Home</h2>
          <div id="subreddit-toggle"></div>
        </header>

        <Groups enableFilter endpoint={'group/getallwithsubreddits'} />
      </section>
      <SubredditWidget
        isLocked={notASmallWindow}
        isExpanded={isExpanded}
        setExpanded={setExpanded}
      />
    </div>
  );
}

export default Home;
