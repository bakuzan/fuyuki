import React from 'react';

import { useAsync } from 'src/hooks/useAsync';
import { Group } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';
import BasePosts from './BasePosts';

interface PostsPageParams {
  subName: string;
}

export default function GroupPosts(props: PageProps) {
  const { subName = '' } = props.match.params as PostsPageParams;

  const { value } = useAsync<Group[]>(
    async () => await sendRequest(`subreddit/GetMemberships/${subName}`),
    [subName]
  );

  const pageTitle = `${subName} Posts`;
  const queryUrl = `/subreddit/${subName}`;
  console.log('RENDER', value);
  return (
    <BasePosts
      {...props}
      pageTitle={pageTitle}
      queryUrl={queryUrl}
      subredditName={subName}
    />
  );
}
