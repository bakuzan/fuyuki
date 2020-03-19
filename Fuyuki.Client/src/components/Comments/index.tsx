import React, { useEffect } from 'react';

import { usePrevious } from 'meiko/hooks/usePrevious';
import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';

import RequestMessage from '../RequestMessage';
import CommentItem from './CommentItem';

import { useAsyncPaged } from 'src/hooks/useAsyncPaged';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { Comment } from 'src/interfaces/Comment';
import alertService from 'src/utils/alertService';
import guardList from 'src/utils/guardList';
import scrollTo from 'src/utils/scrollTo';

import './Comments.scss';

interface CommentsProps {
  endpoint: string;
  focusedComment?: string;
}

function Comments(props: CommentsProps) {
  const { endpoint, focusedComment } = props;
  const [state, fetchPage] = useAsyncPaged<FykResponse<Comment[]>, any>(
    endpoint
  );

  const { loading } = state;
  const prevLoading = usePrevious(loading);

  useEffect(() => {
    fetchPage();
  }, []);

  useEffect(() => {
    if (prevLoading && !loading && focusedComment) {
      requestAnimationFrame(() => {
        const comment = document.getElementById(focusedComment);

        if (comment) {
          const top = comment.offsetTop - 50 - 5; // Account for header + margin
          scrollTo({ top, behavior: 'smooth' });
        } else {
          alertService.showError(
            `Unable to scroll to Comment(Id: ${focusedComment})`,
            `Comment(Id: ${focusedComment}) may not be loaded by the initial comments request.`
          );
        }
      });
    }
  }, [loading, prevLoading, focusedComment]);

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
      {loading ? (
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
