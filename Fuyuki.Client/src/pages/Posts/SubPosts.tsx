import React, { useEffect, useReducer, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';
import slugify from 'ayaka/slugify';
import Accordion from 'meiko/Accordion';
import Icons from 'meiko/constants/icons';
import List from 'meiko/List';
import Tickbox from 'meiko/Tickbox';

import FYKLink from 'src/components/FYKLink';
import { PeekabooContext } from 'src/components/Peekaboo';
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

interface GroupPostsState {
  loading: boolean;
  memberships: GroupMembership[];
}

type GroupPostsAction =
  | { type: 'LoadMemberships'; value: GroupMembership[] }
  | { type: 'ToggleMembership'; groupId: number }
  | { type: 'ToggleLoading' };

function reducer(state: GroupPostsState, action: GroupPostsAction) {
  switch (action.type) {
    case 'ToggleLoading':
      return { ...state, loading: !state.loading };
    case 'LoadMemberships':
      const data = action.value;
      const success = data instanceof Array;
      return { ...state, memberships: success ? data : [] };
    case 'ToggleMembership': {
      const mems = state.memberships;
      const index = mems.findIndex((x) => x.id === action.groupId);
      const item = mems[index];

      return {
        ...state,
        memberships: [
          ...mems.slice(0, index),
          { ...item, isMember: !item.isMember },
          ...mems.slice(index + 1)
        ]
      };
    }
    default:
      return state;
  }
}

export default function GroupPosts(props: PageProps) {
  const { subName = '' } = props.match.params as PostsPageParams;

  const [refreshKey, setRefreshkey] = useState('');
  const [{ loading, memberships }, dispatch] = useReducer(reducer, {
    loading: false,
    memberships: []
  });

  const { value } = useAsync<GroupMembership[]>(
    async () =>
      subName !== rAll
        ? await sendRequest(`subreddit/GetGroupMemberships/${subName}`)
        : Promise.resolve(),
    [subName]
  );

  useEffect(() => {
    if (value) {
      dispatch({ type: 'LoadMemberships', value });
    }
  }, [value]);

  const pageTitle = `${subName} Posts`;
  const queryUrl = `/subreddit/${subName}`;

  const hasMemberships = value !== undefined;
  const membershipCount = memberships.filter((x) => x.isMember).length ?? 0;

  async function handleGroupMembershipToggle(groupId: number) {
    dispatch({ type: 'ToggleLoading' });
    dispatch({ type: 'ToggleMembership', groupId });

    const result = await sendRequest(
      `subreddit/ToggleGroupMembership/${groupId}/${subName}`,
      {
        method: 'PUT'
      }
    );

    if (result.success) {
      // TODO
      // Nice user feedback
    } else {
      dispatch({ type: 'ToggleMembership', groupId });
      alertService.showError(
        result.errorMessages[0],
        `Failed to toggle Subreddit(Name: ${subName}) in Group(Id: ${groupId})`
      );
    }

    dispatch({ type: 'ToggleLoading' });
  }

  console.log('RENDER', memberships, refreshKey);
  return (
    <PeekabooContext.Provider value={refreshKey}>
      <BasePosts
        {...props}
        pageTitle={pageTitle}
        queryUrl={queryUrl}
        subredditName={subName}
      >
        {hasMemberships && (
          <Accordion
            className="memberships"
            heading={
              membershipCount
                ? `${subName} belongs to ${membershipCount} group${
                    membershipCount > 1 ? 's' : ''
                  }`
                : `${subName} is not currently part of any groups.`
            }
            headingProps={{ className: 'memberships__heading' }}
            onToggle={() => setRefreshkey(generateUniqueId())}
          >
            <List shouldWrap>
              {memberships.map((x) => {
                const uid = `group_${slugify(x.name)}`;
                return (
                  <li key={x.id} className="memberships__item">
                    <Tickbox
                      id={uid}
                      className="memberships__tickbox"
                      name={uid}
                      text={x.name}
                      aria-label={`Toggle ${subName} as a member of ${x.name}`}
                      checked={x.isMember}
                      disabled={loading}
                      onChange={() => handleGroupMembershipToggle(x.id)}
                    />
                    <FYKLink
                      to={`/fyk/posts/${x.id}`}
                      aria-label={`View ${x.name} group posts`}
                    >
                      <span aria-hidden={true}>{Icons.link}</span>
                    </FYKLink>
                  </li>
                );
              })}
            </List>
          </Accordion>
        )}
      </BasePosts>
    </PeekabooContext.Provider>
  );
}
