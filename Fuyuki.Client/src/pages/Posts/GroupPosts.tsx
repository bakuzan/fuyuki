import React, { useEffect, useState } from 'react';

import generateUniqueId from 'ayaka/generateUniqueId';

import GroupManagement from 'src/components/GroupManagement';
import Widget, { WidgetToggleZone } from 'src/components/Widget';
import BasePosts from './BasePosts';

import { useAsync } from 'src/hooks/useAsync';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { GroupWithSubreddits } from 'src/interfaces/Group';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

interface PostsPageParams {
  groupId: string;
}

const widgetToggleZoneId = 'group-management-widget';

export default function GroupPosts(props: PageProps<PostsPageParams>) {
  const { groupId = '' } = props.match.params;

  const [resetKey, setResetKey] = useState('');
  const [reQuery, setReQuery] = useState('');
  const [{ value }, fetchGroup] = useAsyncFn<GroupWithSubreddits>(
    async () => await sendRequest(`group/${groupId}`),
    [groupId]
  );

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const groupName = value?.name ?? '';
  const pageTitle = groupName ? `${groupName} Posts` : 'All Posts';
  const queryUrl = `/group/${groupId}${reQuery ? `?fyk=${reQuery}` : ''}`;

  return (
    <BasePosts
      {...props}
      pageTitle={pageTitle}
      queryUrl={queryUrl}
      header={<WidgetToggleZone id={widgetToggleZoneId} />}
      renderWidget={(wProps) => (
        <Widget
          className="group-management-widget"
          name="group management"
          title="Group Management"
          firstId="name"
          lastId="cancelGroup"
          toggleZoneId={widgetToggleZoneId}
          exceptionClasses={[
            'form-name-clear',
            'subreddits__remove',
            'save-group-button',
            'cancel-group-button'
          ]}
          {...wProps}
        >
          {value && (
            <GroupManagement
              key={resetKey}
              data={value}
              onSubmitSuccess={(payload) => {
                const noSubredditChanges =
                  payload.subreddits.length === value.subreddits.length &&
                  payload.subreddits.every((x) =>
                    value.subreddits.some((y) => y.name === x.name)
                  );

                fetchGroup();

                if (!noSubredditChanges) {
                  setReQuery(generateUniqueId());
                }
              }}
              onCancel={() => setResetKey(generateUniqueId())}
            />
          )}
        </Widget>
      )}
    />
  );
}
