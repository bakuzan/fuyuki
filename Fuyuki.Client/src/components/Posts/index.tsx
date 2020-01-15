import React, { useState, useEffect } from 'react';

import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import { usePrevious } from 'meiko/hooks/usePrevious';
import { useProgressiveLoading } from 'meiko/hooks/useProgressiveLoading';
import RequestMessage from '../RequestMessage';
import PostItem from './PostItem';

import { useAsyncPaged } from 'src/hooks/useAsyncPaged';
import { ApiResponse, FykResponse } from 'src/interfaces/ApiResponse';
import { Post } from 'src/interfaces/Post';

import './Posts.scss';

interface PostsProps {
  endpoint: string;
}

function Posts(props: PostsProps) {
  const { endpoint } = props;

  const [ready, setReady] = useState(false);
  const [postsAfter, setPostsAfter] = useState('');
  const [state, fetchPage] = useAsyncPaged<FykResponse<Post[]>, any>(endpoint);
  const prevEndpoint = usePrevious(endpoint);

  useEffect(() => {
    if (prevEndpoint && endpoint && endpoint !== prevEndpoint) {
      setPostsAfter('');
    }
  }, [endpoint, prevEndpoint]);

  useEffect(() => {
    fetchPage(postsAfter);
  }, [postsAfter]);

  const currentlyLoading = state.loading;
  const items = state.value instanceof Array ? state.value : [];
  const itemCount = items.length;
  const hasNoItems = itemCount === 0;
  const lastPostId = items[itemCount - 1]?.fullname ?? '';

  useEffect(() => {
    // This is to ensure the prog loader can initialise.
    if (!ready && itemCount) {
      setReady(true);
    }
  }, [ready, itemCount]);

  const ref = useProgressiveLoading<HTMLUListElement>(() => {
    if (!currentlyLoading && postsAfter !== lastPostId) {
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
          <li key={x.fullname} className="posts__item">
            <PostItem index={i} headingTag="h3" data={x} />
          </li>
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
