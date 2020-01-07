import React, { useState } from 'react';

import { Button } from 'meiko/Button';
import NewTabLink from 'meiko/NewTabLink';
import FYKLink from '../FYKLink';
import AwardsBlock from '../AwardsBlock';
import Flair from '../FlairBlock';
import { Comment } from 'src/interfaces/Comment';
import thousandFormat from 'src/utils/thousandFormat';
import formatDateTimeForDisplay from 'ayaka/formatDateTimeForDisplay';
import formatDateTimeAgo from 'src/utils/formatDateTimeAgo';

import './CommentItem.scss';

const BAD_DATE = '0001-01-01T00:00:00';

interface CommentItemProps {
  index: number;
  data: Comment;
}

function CommentItem(props: CommentItemProps) {
  const [collapsed, setCollapsed] = useState(props.data.collapsed);
  const x = props.data;
  const isEdited = x.edited !== BAD_DATE && x.edited;
  const commentDate = isEdited ? x.edited : x.created;

  return (
    <li className="comments__item">
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
          <Flair text={''} />
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
        </div>
        {!collapsed && (
          <React.Fragment>
            <div className="comment__body">{x.body}</div>
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
    </li>
  );
}

export default React.memo(CommentItem);
