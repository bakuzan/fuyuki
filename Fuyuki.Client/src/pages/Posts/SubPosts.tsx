import React from 'react';

import List from 'meiko/List';
import Accordion from 'src/components/Accordion';
import FYKLink from 'src/components/FYKLink';
import BasePosts from './BasePosts';

import { useAsync } from 'src/hooks/useAsync';
import { GroupMembership } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

interface PostsPageParams {
  subName: string;
}

export default function GroupPosts(props: PageProps) {
  const { subName = '' } = props.match.params as PostsPageParams;

  const { value } = useAsync<GroupMembership[]>(
    async () =>
      subName !== 'all'
        ? await sendRequest(`subreddit/GetGroupMemberships/${subName}`)
        : Promise.resolve(),
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
    >
      {value && (
        <div>
          <Accordion
            heading={
              value.length
                ? `${subName} belongs to ${value.length} group${
                    value.length > 1 ? 's' : ''
                  }`
                : `${subName} is not currently part of any groups.`
            }
          >
            <List>
              {value.map((x) => (
                <li key={x.id}>
                  <FYKLink to={`/fyk/posts/${x.id}`}>{x.name}</FYKLink>
                </li>
              ))}
            </List>
          </Accordion>
        </div>
      )}
    </BasePosts>
  );
}
