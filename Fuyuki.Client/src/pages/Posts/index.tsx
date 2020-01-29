import classNames from 'classnames';
import React, { useState } from 'react';
import Helmet from 'react-helmet';

import { useWindowSize } from 'meiko/hooks/useWindowSize';
import NewTabLink from 'meiko/NewTabLink';

import FYKLink from 'src/components/FYKLink';
import Peekaboo from 'src/components/Peekaboo';
import Posts from 'src/components/Posts';
import SearchWidget from 'src/components/SearchWidget';

import { useAsync } from 'src/hooks/useAsync';
import { Group } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import { isXS } from 'src/utils/media';
import sendRequest from 'src/utils/sendRequest';

import './Posts.scss';

const urlBase = `/reddit/posts`;

interface PostsPageParams {
  groupId?: string;
  subName?: string;
}

function PostsPage(props: PageProps) {
  const { groupId = '', subName = '' } = props.match.params as PostsPageParams;
  const [expanded, setExpanded] = useState(false);

  const size = useWindowSize();
  const notASmallWindow = !isXS(size.width);
  const isExpanded = notASmallWindow || expanded;

  const { value } = useAsync<Group>(
    async () =>
      groupId ? await sendRequest(`group/${groupId}`) : Promise.resolve(),
    [groupId]
  );

  const isSubreddit = !groupId && !!subName;
  const groupName = value?.name ?? subName ?? '';
  const pageTitle = groupName ? `${groupName} Posts` : 'All Posts';
  const queryUrl = groupId
    ? `/group/${groupId}`
    : subName
    ? `/subreddit/${subName}`
    : '';

  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <section className={classNames('posts', { 'posts--margin': isExpanded })}>
        <Peekaboo>
          <header className="page__header page__header--spaced">
            {(!groupId || (groupId && groupName)) && (
              <h2 className="page__title">{pageTitle}</h2>
            )}
            <div id="search-toggle"></div>
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
        <Posts endpoint={`${urlBase}${queryUrl}`} />
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
