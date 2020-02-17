import React from 'react';

import slugify from 'ayaka/slugify';
import List from 'meiko/List';
import Tickbox from 'meiko/Tickbox';

import Accordion from 'src/components/Accordion';
import FYKLink from 'src/components/FYKLink';
import BasePosts from './BasePosts';

import { useAsync } from 'src/hooks/useAsync';
import { GroupMembership } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import alertService from 'src/utils/alertService';
import sendRequest from 'src/utils/sendRequest';

const rAll = 'all';

interface PostsPageParams {
  subName: string;
}

export default function GroupPosts(props: PageProps) {
  const { subName = '' } = props.match.params as PostsPageParams;

  const { value } = useAsync<GroupMembership[]>(
    async () =>
      subName !== rAll
        ? await sendRequest(`subreddit/GetGroupMemberships/${subName}`)
        : Promise.resolve(),
    [subName]
  );

  const pageTitle = `${subName} Posts`;
  const queryUrl = `/subreddit/${subName}`;

  const membershipCount = value?.filter((x) => x.isMember).length ?? 0;

  async function handleGroupMembershipToggle(groupId: number) {
    // TODO
    // optimistic Update of the membership data
    const result = await sendRequest(
      `subreddit/ToggleGroupMembership/${groupId}/${subName}`,
      {
        method: 'PUT'
      }
    );

    if (result.success) {
      // TODO
      // Nice user feedback...a toaster?
    } else {
      // TODO
      // following above todos...rollback optimistic update
      alertService.showError(
        result.errorMessages[0],
        `Failed to toggle Subreddit(Name: ${subName}) in Group(Id: ${groupId})`
      );
    }
  }

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
              membershipCount
                ? `${subName} belongs to ${membershipCount} group${
                    membershipCount > 1 ? 's' : ''
                  }`
                : `${subName} is not currently part of any groups.`
            }
          >
            <List shouldWrap>
              {value.map((x) => {
                const uid = `group_${slugify(x.name)}`;
                return (
                  <li key={x.id}>
                    <Tickbox
                      id={uid}
                      name={uid}
                      label={x.name}
                      aria-label={`Toggle ${subName} as a member of ${x.name}`}
                      checked={x.isMember}
                      onChange={() => handleGroupMembershipToggle(x.id)}
                    />
                    <FYKLink
                      to={`/fyk/posts/${x.id}`}
                      aria-label={`View ${x.name} group posts`}
                    >
                      <span aria-hidden={true}>#</span>
                    </FYKLink>
                  </li>
                );
              })}
            </List>
          </Accordion>
        </div>
      )}
    </BasePosts>
  );
}
