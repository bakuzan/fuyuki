import classNames from 'classnames';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import { useWindowSize } from 'meiko/hooks/useWindowSize';

import { LinkAsButton } from 'src/components/Buttons';
import FYKLink from 'src/components/FYKLink';
import Groups from 'src/components/Groups';
import SearchWidget, {
  SearchWidgetToggleZone
} from 'src/components/SearchWidget';
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
          <SearchWidgetToggleZone />
          <div>
            <LinkAsButton className="add-link" btnStyle="primary" to={`group/`}>
              Add new group
            </LinkAsButton>
          </div>
        </header>

        <Groups enableFilter endpoint={'group/getallwithsubreddits'} />
      </section>
      <SearchWidget
        endpoint="/Reddit/Subreddit/search"
        isExpanded={isExpanded}
        isLocked={notASmallWindow}
        itemName="subreddit"
        renderContent={({ data }) => (
          <FYKLink
            id={`search-${data.id}`}
            className="search-widget__content"
            noShadow
            to={`/r/posts/${data.name}`}
          >
            r/{data.name}
          </FYKLink>
        )}
        setExpanded={setExpanded}
      />
    </div>
  );
}

export default Home;
