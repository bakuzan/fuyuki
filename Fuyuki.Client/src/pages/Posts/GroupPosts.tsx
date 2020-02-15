import React from 'react';

import { useAsync } from 'src/hooks/useAsync';
import { GroupWithSubreddits } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';
import BasePosts from './BasePosts';

interface PostsPageParams {
  groupId: string;
}

export default function GroupPosts(props: PageProps) {
  const { groupId = '' } = props.match.params as PostsPageParams;

  const { value } = useAsync<GroupWithSubreddits>(
    async () => await sendRequest(`group/${groupId}`),
    [groupId]
  );

  const groupName = value?.name ?? '';
  const pageTitle = groupName ? `${groupName} Posts` : 'All Posts';
  const queryUrl = `/group/${groupId}`;

  return <BasePosts {...props} pageTitle={pageTitle} queryUrl={queryUrl} />;
}
