import React, { useState, useEffect } from 'react';

import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import { usePrevious } from 'meiko/hooks/usePrevious';
import { useProgressiveLoading } from 'meiko/hooks/useProgressiveLoading';
import RequestMessage from '../RequestMessage';
import CommentItem from './CommentItem';

import { useAsyncPaged } from 'src/hooks/useAsyncPaged';
import { ApiResponse } from 'src/interfaces/ApiResponse';
import { Comment } from 'src/interfaces/Comment';

// import './Comments.scss';

interface CommentsProps {
  endpoint: string;
}

function Comments(props: CommentsProps) {
  const { endpoint } = props;
  const [commentsAfter, setCommentsAfter] = useState('');
  const [state, fetchPage] = useAsyncPaged<Comment[] | ApiResponse, any>(
    endpoint
  );

  const prevEndpoint = usePrevious(endpoint);

  useEffect(() => {
    if (prevEndpoint && endpoint && endpoint !== prevEndpoint) {
      setCommentsAfter('');
    }
  }, [endpoint, prevEndpoint]);

  useEffect(() => {
    fetchPage(commentsAfter);
  }, [commentsAfter]);

  const items = state.value instanceof Array ? state.value : [];
  const hasNoItems = items.length === 0;
  //   const lastPostId = items[items.length - 1]?.fullname ?? '';
  console.log('comments...', props, state, items);
  //   const ref = useProgressiveLoading<HTMLUListElement>(() => {
  //     console.log(
  //       '%c Prog load...',
  //       'color:forestgreen;',
  //       state,
  //       commentsAfter,
  //       lastPostId
  //     );
  //     if (!state.loading && commentsAfter !== lastPostId) {
  //       setCommentsAfter(lastPostId);
  //     }
  //   });

  const badResponse = state.value as ApiResponse;
  if (state.error || badResponse?.error) {
    return <RequestMessage text={'Failed to fetch comments'} />;
  }

  return (
    <div>
      <List className="comments" columns={1}>
        {items.map((x: Comment, i: number) => (
          <CommentItem key={x.id} index={i} data={x} />
        ))}
      </List>
      {state.loading ? (
        <LoadingBouncer />
      ) : (
        hasNoItems && (
          <div className="comments__item comments__item--no-items">
            No comments available
          </div>
        )
      )}
    </div>
  );
}

export default Comments;
