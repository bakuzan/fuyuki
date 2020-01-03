import React, { useState, useEffect } from 'react';

import List from 'meiko/List';
import PostItem from './PostItem';

import { useAsyncFn } from 'src/hooks/useAsyncFn';
import { Post } from 'src/interfaces/Post';
import sendRequest from 'src/utils/sendRequest';

import './Posts.scss';

interface PostsProps {
  endpoint: string;
}

function Posts(props: PostsProps) {
  const [postsAfter, setPostsAfter] = useState('');
  const { endpoint } = props;

  const [state, fetchPage] = useAsyncFn<any[], any>(
    async (lastPostId: string) => await sendRequest(`${endpoint}${lastPostId}`),
    [endpoint]
  );

  useEffect(() => {
    fetchPage(postsAfter);
  }, [postsAfter]);

  console.log('Posts', props, state);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Failed to fetch posts</div>;
  }

  const isSuccess = state.value && state.value instanceof Array;
  const items = isSuccess ? (state.value as Post[]) : [];
  const hasNoItems = items.length === 0;
  const lastPostId = items[items.length - 1]?.fullname ?? '';
  console.log('posts...', state, items);
  return (
    <div>
      <List className="posts" columns={1}>
        {hasNoItems && (
          <li key="NONE" className="posts__item posts__item--no-items">
            No posts available
          </li>
        )}
        {items.map((x: Post, i) => (
          <PostItem key={x.id} index={i} data={x} />
        ))}
      </List>
      <button type="button" onClick={() => setPostsAfter(lastPostId)}>
        Next Page
      </button>
    </div>
  );
}

export default Posts;
