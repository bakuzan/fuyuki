import classNames from 'classnames';
import React, { useState } from 'react';
import Helmet from 'react-helmet';

import { useWindowSize } from 'meiko/hooks/useWindowSize';
import NewTabLink from 'meiko/NewTabLink';

import FYKLink from 'src/components/FYKLink';
import Peekaboo from 'src/components/Peekaboo';
import Posts from 'src/components/Posts';
import SearchWidget, {
  SearchWidgetToggleZone
} from 'src/components/SearchWidget';

import { PageProps } from 'src/interfaces/PageProps';
import { isXS } from 'src/utils/media';

import './Posts.scss';

const urlBase = `/reddit/posts`;

interface PostsPageProps extends PageProps {
  pageTitle: string;
  queryUrl: string;
  subredditName?: string;
}

function PostsPage(props: PostsPageProps) {
  const [expanded, setExpanded] = useState(false);

  const size = useWindowSize();
  const notASmallWindow = !isXS(size.width);
  const isExpanded = notASmallWindow || expanded;

  const subName = props.subredditName;
  const isSubreddit = props.subredditName !== undefined;
  const shouldMargin = isSubreddit && isExpanded;

  return (
    <div className="page">
      <Helmet title={props.pageTitle} />
      <section
        className={classNames('posts', {
          'posts--margin': shouldMargin
        })}
      >
        <Peekaboo className={classNames({ 'peekaboo--margin': shouldMargin })}>
          <header className="page__header page__header--spaced">
            <h2 className="page__title">{props.pageTitle}</h2>
            <SearchWidgetToggleZone />
            {subName && (
              <NewTabLink
                className="regular-link"
                href={`https://www.reddit.com/r/${subName}`}
                aria-label={`View r/${subName} on reddit`}
              >
                <span aria-hidden={true}>View r/{subName} on reddit</span>
              </NewTabLink>
            )}
          </header>
        </Peekaboo>
        <Posts endpoint={`${urlBase}${props.queryUrl}`} />
      </section>
      {isSubreddit && (
        <SearchWidget
          endpoint={`/Reddit/Post/search/${subName}`}
          isExpanded={isExpanded}
          isLocked={notASmallWindow}
          isSortable
          itemName="post"
          renderContent={({ data }) => (
            <FYKLink
              id={`search-${data.id}`}
              className="search-widget__content"
              noShadow
              to={`/post/${data.fullname}/comments`}
            >
              {data.name}
            </FYKLink>
          )}
          setExpanded={setExpanded}
        />
      )}
    </div>
  );
}

export default PostsPage;
