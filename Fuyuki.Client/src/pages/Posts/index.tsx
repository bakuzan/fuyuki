import React from 'react';
import Helmet from 'react-helmet';

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
      <header className="page__header">
        <h2 className="page__title">{pageTitle}</h2>
      </header>
      <Posts endpoint={`${urlBase}${queryUrl}`} />
    </div>
  );
}

export default PostsPage;
