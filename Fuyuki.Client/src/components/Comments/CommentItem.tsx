import classNames from 'classnames';
import React, { useState } from 'react';

import { Button } from 'meiko/Button';
import NewTabLink from 'meiko/NewTabLink';
import List from 'meiko/List';
import AwardsBlock from '../AwardsBlock';
import Flair from '../FlairBlock';
import { Comment } from 'src/interfaces/Comment';
import thousandFormat from 'src/utils/thousandFormat';
import formatDateTimeForDisplay from 'ayaka/formatDateTimeForDisplay';
import formatDateTimeAgo from 'src/utils/formatDateTimeAgo';

import './CommentItem.scss';

const BAD_DATE = '0001-01-01T00:00:00';
const stickyMessage = "selected by this subreddit's moderators";

interface CommentItemProps {
  index: number;
  data: Comment;
}

const CommentItem = React.memo(function(props: CommentItemProps) {
  const [collapsed, setCollapsed] = useState(props.data.collapsed);
  const x = props.data;
  const isEdited = x.edited !== BAD_DATE && x.edited;
  const commentDate = isEdited ? x.edited : x.created;
  const hasReplies = x.replies && x.replies.length > 0;

  if (!x.permalink) {
    // TODO
    // Implement a query to get more replies using x.depth and x.parentFullname...
    return <li className="comments__item">See more...</li>;
  }

  return (
    <li
      className={classNames('comments__item', {
        'comments__item--stickied': x.stickied
      })}
    >
      <article className="comment">
        <div className="comment__top-bar">
          <div>
            <Button
              className="comment__toggle"
              btnSize="small"
              aria-label={collapsed ? 'Expand comment' : 'Collapse comment'}
              onClick={() => setCollapsed((p) => !p)}
            >
              <span aria-hidden={true}>[{collapsed ? '+' : '-'}]</span>
            </Button>
          </div>

          <NewTabLink
            className="comment__authour fyk-link fyk-link--shadowless"
            href={`https://www.reddit.com/user/${x.author}`}
          >
            {x.author}
          </NewTabLink>
          {x.distinguished && (
            <div
              className="comment__distinguished"
              title={x.distinguished}
              aria-label={x.distinguished}
            >
              <span aria-hidden={true}>[{x.distinguished.slice(0, 1)}]</span>
            </div>
          )}
          <Flair text={x.authorFlairText} />
          <AwardsBlock data={x.awards} />
          <span className="comment__karma">
            {thousandFormat(x.score)} points
          </span>
          {isEdited ? `Edited ` : ''}
          <time
            className="comment__posted"
            dateTime={commentDate}
            title={formatDateTimeForDisplay(commentDate)}
          >
            {formatDateTimeAgo(commentDate)}
          </time>
          {x.stickied && (
            <div
              className="comment__stickied"
              title={stickyMessage}
              aria-label={stickyMessage}
            >
              stickied
            </div>
          )}
        </div>
        {!collapsed && (
          <React.Fragment>
            <div className="comment__body">
              <div
                dangerouslySetInnerHTML={{
                  __html: !x.removed
                    ? x.bodyHTML
                    : '<p>[Removed for some reason]</p>'
                }}
              ></div>
            </div>
            <div className="comment__footer">
              <NewTabLink
                className="comment__other-link"
                href={`https://www.reddit.com/${x.permalink}`}
              >
                reddit permalink
              </NewTabLink>
            </div>
          </React.Fragment>
        )}
      </article>
      {hasReplies && !collapsed && (
        <List
          style={{ paddingLeft: `${(x.depth + 1) * 12}px` }}
          className="comments"
          columns={1}
        >
          {x.replies.map((reply, j) => (
            <CommentItem key={reply.id} index={j} data={reply} />
          ))}
        </List>
      )}
    </li>
  );
});

export default CommentItem;
