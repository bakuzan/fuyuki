import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import formatDateTimeForDisplay from 'ayaka/formatDateTimeForDisplay';
import { Button } from 'meiko/Button';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import NewTabLink from 'meiko/NewTabLink';

import AwardsBlock from '../AwardsBlock';
import { SeeMoreButton } from '../Buttons';
import Flair from '../FlairBlock';

import { PostContext } from 'src/context';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { Comment } from 'src/interfaces/Comment';
import formatDateTimeAgo from 'src/utils/formatDateTimeAgo';
import htmlBodyReplacements from 'src/utils/htmlBodyReplacements';
import sendRequest from 'src/utils/sendRequest';
import thousandFormat from 'src/utils/thousandFormat';

import './CommentItem.scss';

const BAD_DATE = '0001-01-01T00:00:00';
const stickyMessage = `selected by this subreddit's moderators`;

interface CommentItemProps {
  index: number;
  data: Comment;
}

const CommentItem = React.memo(function(props: CommentItemProps) {
  const { postId } = useContext(PostContext);
  const [collapsed, setCollapsed] = useState(props.data.collapsed);

  const [moreState, fetchMore] = useAsyncFn<Comment[], any>(
    async (commentIds: string[]) =>
      await sendRequest(`reddit/morecomments`, {
        body: JSON.stringify({ postId, commentIds }),
        method: 'POST'
      }),
    [postId]
  );

  const x = props.data;
  const isEdited = x.edited !== BAD_DATE && x.edited;
  const commentDate = isEdited ? x.edited : x.created;
  const moreCommentIds = (x.more || []).reduce(
    (p, c) => [...p, ...c.children],
    [] as string[]
  );

  const replies = moreState.value as Comment[];
  const hasReplies = moreState.value instanceof Array;
  const hasMore = !hasReplies && moreCommentIds.length > 0;
  const itemReplies = x.replies ?? [];
  const allReplies = hasReplies ? [...itemReplies, ...replies] : itemReplies;
  const showReplies = allReplies.length > 0;

  const isSeeMoreLink = !x.permalink;
  const isTopLevel = x.depth === 0;

  console.log(moreState);

  if (isSeeMoreLink && isTopLevel) {
    if (replies) {
      return (
        <React.Fragment>
          {replies.map((reply, j) => (
            <CommentItem key={reply.id} index={j} data={reply} />
          ))}
        </React.Fragment>
      );
    }

    return (
      <li className="comments__item">
        <div className="see-more">
          {!moreState.loading && (
            <SeeMoreButton onClick={() => fetchMore([x.id])} />
          )}
          {moreState.loading && (
            <LoadingBouncer className="loading-bouncer--local" />
          )}
        </div>
      </li>
    );
  }

  return (
    <li
      className={classNames('comments__item', {
        'comments__item--stickied': x.stickied
      })}
    >
      {x.permalink && (
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
            {x.isSubmitter && (
              <div
                className="comment__submitter"
                title="submitter"
                aria-label="user is post submitter"
              >
                <span aria-hidden={true}>[s]</span>
              </div>
            )}
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
                      ? htmlBodyReplacements(x.bodyHTML)
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
      )}
      {showReplies && !collapsed && (
        <List
          style={{ paddingLeft: `${(x.depth + 1) * 12}px` }}
          className="comments"
          columns={1}
        >
          {allReplies.map((reply, j) => (
            <CommentItem key={reply.id} index={j} data={reply} />
          ))}
        </List>
      )}
      {hasMore && !collapsed && (
        <div className="see-more">
          {!moreState.loading && (
            <SeeMoreButton onClick={() => fetchMore(moreCommentIds)} />
          )}
          {moreState.loading && (
            <LoadingBouncer className="loading-bouncer--local" />
          )}
        </div>
      )}
    </li>
  );
});

export default CommentItem;
