import React, { useState, useEffect } from 'react';

import List from 'meiko/List';
import LoadingBouncer from 'meiko/LoadingBouncer';
import { usePrevious } from 'meiko/hooks/usePrevious';
import { useProgressiveLoading } from 'meiko/hooks/useProgressiveLoading';
import RequestMessage from '../RequestMessage';
import PostItem from './PostItem';

import { useAsyncPaged } from 'src/hooks/useAsyncPaged';
import { Post } from 'src/interfaces/Post';

import './Posts.scss';

interface PostsProps {
  endpoint: string;
}

function Posts(props: PostsProps) {
  const { endpoint } = props;
  const [postsAfter, setPostsAfter] = useState('');
  const [state, fetchPage] = useAsyncPaged<Post[], any>(endpoint);

  const prevEndpoint = usePrevious(endpoint);

  useEffect(() => {
    if (endpoint !== prevEndpoint) {
      console.log('Reset posts after');
      setPostsAfter('');
    }
  }, [endpoint, prevEndpoint]);

  useEffect(() => {
    console.log('Fetch posts page > ', postsAfter);
    fetchPage(postsAfter);
  }, [postsAfter]);

  console.log('Posts', props, state);

  const items = state.value ?? [];
  const hasNoItems = items.length === 0;
  const lastPostId = items[items.length - 1]?.fullname ?? '';

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

  if (state.loading && hasNoItems) {
    return <RequestMessage text="Loading..." />;
  }

  if (state.error) {
    return <RequestMessage text="Failed to fetch posts" />;
  }

  console.log('posts...', state, items);

  return (
    <div>
      <List ref={ref} className="posts" columns={1}>
        {hasNoItems && (
          <li key="NONE" className="posts__item posts__item--no-items">
            No posts available
          </li>
        )}
        {items.map((x: Post, i) => (
          <PostItem key={x.id} index={i} data={x} />
        ))}
      </List>
      {state.loading && <LoadingBouncer />}
    </div>
  );
}

export default Posts;
