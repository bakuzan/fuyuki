import React, { useState, useEffect } from 'react';

import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import { usePrevious } from 'meiko/hooks/usePrevious';
import { useProgressiveLoading } from 'meiko/hooks/useProgressiveLoading';
import RequestMessage from '../RequestMessage';
import PostItem from './PostItem';

import { useAsyncPaged } from 'src/hooks/useAsyncPaged';
import { ApiResponse } from 'src/interfaces/ApiResponse';
import { Post } from 'src/interfaces/Post';

import './Posts.scss';

interface PostsProps {
  endpoint: string;
}

function Posts(props: PostsProps) {
  const { endpoint } = props;
  const [postsAfter, setPostsAfter] = useState('');
  const [state, fetchPage] = useAsyncPaged<Post[] | ApiResponse, any>(endpoint);

  const prevEndpoint = usePrevious(endpoint);

  useEffect(() => {
    if (prevEndpoint && endpoint && endpoint !== prevEndpoint) {
      setPostsAfter('');
    }
  }, [endpoint, prevEndpoint]);

  useEffect(() => {
    fetchPage(postsAfter);
  }, [postsAfter]);

  const items = state.value instanceof Array ? state.value : [];
  const hasNoItems = items.length === 0;
  const lastPostId = items[items.length - 1]?.fullname ?? '';
  console.log('posts...', props, state, items);
  const ref = useProgressiveLoading<HTMLUListElement>(() => {
    console.log(
      '%c Prog load...',
      'color:forestgreen;',
      state,
      postsAfter,
      lastPostId
    );
    if (!state.loading && postsAfter !== lastPostId) {
      setPostsAfter(lastPostId);
    }
  });

  const badResponse = state.value as ApiResponse;
  if (state.error || badResponse?.error) {
    return <RequestMessage text={'Failed to fetch posts'} />;
  }

  return (
    <div>
      <List ref={ref} className="posts" columns={1}>
        {items.map((x: Post, i) => (
          <PostItem key={x.id} index={i} data={x} />
        ))}
      </List>
      {state.loading ? (
        <LoadingBouncer />
      ) : (
        hasNoItems && (
          <div className="posts__item posts__item--no-items">
            No posts available
          </div>
        )
      )}
    </div>
  );
}

export default Posts;
