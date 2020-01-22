import React, { useEffect } from 'react';

import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import RequestMessage from '../RequestMessage';
import CommentItem from './CommentItem';

import { useAsyncPaged } from 'src/hooks/useAsyncPaged';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { Comment } from 'src/interfaces/Comment';
import guardList from 'src/utils/guardList';

import './Comments.scss';

interface CommentsProps {
  endpoint: string;
}

function Comments(props: CommentsProps) {
  const { endpoint } = props;
  const [state, fetchPage] = useAsyncPaged<FykResponse<Comment[]>, any>(
    endpoint
  );

  useEffect(() => {
    fetchPage();
  }, []);

  const items = guardList(state);
  const hasNoItems = items.length === 0;

  const badResponse = state.value as ApiResponse;
  if (state.error || badResponse?.error) {
    return <RequestMessage text={'Failed to fetch comments'} />;
  }

  return (
    <div>
      <List className="comments" columns={1}>
        {items.map((x: Comment, i: number) => (
          <CommentItem key={x.fullname} index={i} data={x} />
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
