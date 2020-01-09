import React from 'react';
import Helmet from 'react-helmet';

import NewTabLink from 'meiko/NewTabLink';
import Posts from 'src/components/Posts';

import { useAsync } from 'src/hooks/useAsync';
import { Group } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

const urlBase = `/reddit/posts`;

interface PostsPageParams {
  groupId?: string;
  subName?: string;
}

function PostsPage(props: PageProps) {
  const { groupId = '', subName = '' } = props.match.params as PostsPageParams;
  console.log('Posts page .... ', props);
  const { value } = useAsync<Group>(
    async () =>
      groupId ? await sendRequest(`group/${groupId}`) : Promise.resolve(),
    [groupId]
  );

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
      <header className="page__header page__header--spaced">
        {(!groupId || (groupId && groupName)) && (
          <h2 className="page__title">{pageTitle}</h2>
        )}
        {subName && (
          <NewTabLink
            href={`https://www.reddit.com/r/${subName}`}
            aria-label={`View r/${subName} on reddit`}
          >
            <span aria-hidden={true}>View r/{subName} on reddit</span>
          </NewTabLink>
        )}
      </header>
      <Posts endpoint={`${urlBase}${queryUrl}`} />
    </div>
  );
}

export default PostsPage;
