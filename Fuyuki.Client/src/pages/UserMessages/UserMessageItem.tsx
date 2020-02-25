import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import formatDateTimeForDisplay from 'ayaka/formatDateTimeForDisplay';
import NewTabLink from 'meiko/NewTabLink';

import { Button } from 'meiko/Button';
import { MainContext } from 'src/context';
import { UserMessage } from 'src/interfaces/UserMessage';
import htmlBodyReplacements from 'src/utils/htmlBodyReplacements';
import sendRequest from 'src/utils/sendRequest';

import './UserMessageItem.scss';

interface UserMessageItemProps {
  data: UserMessage;
}

function UserMessageItem({ data }: UserMessageItemProps) {
  const { onMessageRefresh } = useContext(MainContext);
  const [read, setRead] = useState(!data.new);
  const x = data;

  const showFooter = !!x.context;
  const markReadLabel = read ? 'Read' : 'Mark as read';

  async function onMarkRead() {
    setRead(true);

    const response = await sendRequest(`/reddit/usermessages/markasread`, {
      body: JSON.stringify({ messageId: x.name }),
      method: 'POST'
    });

    if (response.success) {
      onMessageRefresh();
    } else {
      setRead(false);
    }
  }

  return (
    <li className={classNames('mail', { 'mail--unread': !read })}>
      <div className="mail__top">
        <time className="mail__time" dateTime={x.created} title={x.created}>
          {formatDateTimeForDisplay(x.created)}
        </time>
        {data.new && (
          <Button
            className="mail__mark-button"
            btnStyle={read ? undefined : 'primary'}
            btnSize="small"
            aria-label={markReadLabel}
            title={markReadLabel}
            icon={`\u2709\uFE0E`}
            disabled={read}
            onClick={onMarkRead}
          />
        )}
      </div>
      <div>
        <div>
          <strong>From: </strong>
          {x.author}
        </div>
        <div>
          <strong>To: </strong>
          {x.dest}
        </div>
        <div>
          <strong>Subject: </strong>
          {x.subject}
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: htmlBodyReplacements(x.bodyHTML)
        }}
      />
      {showFooter && (
        <div className="mail__footer">
          {x.context && (
            <NewTabLink
              className="mail__origin"
              href={`https://reddit.com${x.context}`}
            >
              origin on {x.subredditNamePrefixed}
            </NewTabLink>
          )}
        </div>
      )}
    </li>
  );
}

export default UserMessageItem;
