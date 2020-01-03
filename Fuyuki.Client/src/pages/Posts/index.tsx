import React from 'react';
import Helmet from 'react-helmet';

import Posts from 'src/components/Posts';
import { useAsync } from 'src/hooks/useAsync';
import { Group } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

interface PostsPageParams {
  groupId?: string;
  subName?: string;
}

function PostsPage(props: PageProps) {
  const { groupId = '', subName = '' } = props.match.params as PostsPageParams;

  const { value } = useAsync<Group>(
    async () =>
      groupId ? await sendRequest(`group/${groupId}`) : Promise.resolve(),
    [groupId]
  );

  const groupName = value?.name ?? subName ?? '';
  const pageTitle = groupId ? `${groupName} Posts` : 'All Posts';
  const queryUrl = groupId ? `reddit/${groupId}/posts/` : `reddit/posts/`;

  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <header className="page__header">
        <h2 className="page__title">{pageTitle}</h2>
      </header>
      <Posts endpoint={queryUrl} />
    </div>
  );
}

export default PostsPage;
