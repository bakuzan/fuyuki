import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';

import { PageProps } from 'src/interfaces/PageProps';
import { useAsyncFn } from 'src/hooks/useAsyncFn';
import sendRequest from 'src/utils/sendRequest';

interface PostsPageParams {
  groupId?: string;
}

function PostsPage(props: PageProps) {
  const { groupId = '' } = props.match.params as PostsPageParams;
  const [postsAfter, setPostsAfter] = useState('');

  const pageTitle = groupId ? '<group> Posts' : 'All Posts';
  const queryUrl = groupId ? `reddit/${groupId}/posts/` : `reddit/posts/`;

  const [state, fetchPage] = useAsyncFn<any[], any>(
    async (lastPostId: string) => await sendRequest(`${queryUrl}${lastPostId}`),
    [queryUrl]
  );

  const lastPostId = '';

  useEffect(() => {
    fetchPage(postsAfter);
  }, [postsAfter]);

  console.log('Posts...', lastPostId, postsAfter, state);

  return (
    <div>
      <Helmet title={pageTitle} />
      <h1>Hello, world!</h1>
      <p>This is the placeholder home page</p>
      <button type="button" onClick={() => setPostsAfter(lastPostId)}>
        Next Page
      </button>
    </div>
  );
}

export default PostsPage;
