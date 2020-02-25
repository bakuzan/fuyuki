import React, { useState } from 'react';

import formatDateTimeForDisplay from 'ayaka/formatDateTimeForDisplay';
import NewTabLink from 'meiko/NewTabLink';

import { Button } from 'meiko/Button';
import { UserMessage } from 'src/interfaces/UserMessage';
import htmlBodyReplacements from 'src/utils/htmlBodyReplacements';

interface UserMessageItemProps {
  data: UserMessage;
}

function UserMessageItem({ data }: UserMessageItemProps) {
  const [read, setRead] = useState(!data.new);
  const x = data;
  const showFooter = !!x.context;

  function onMarkRead() {
    // TODO
    // Make api call to set it as read...
    setRead(true);
  }

  return (
    <li className="mail">
      <div className="mail__top">
        <time className="mail__time" dateTime={x.created} title={x.created}>
          {formatDateTimeForDisplay(x.created)}
        </time>
        {!read && (
          <Button
            className="mail__mark-button"
            btnStyle="primary"
            btnSize="small"
            icon={`\u2709\uFE0E`}
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
