import React from 'react';
import Helmet from 'react-helmet';

import Comments from 'src/components/Comments';
import RequestMessage from 'src/components/RequestMessage';
import { useAsync } from 'src/hooks/useAsync';
import { Post } from 'src/interfaces/Post';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';
import NewTabLink from 'meiko/NewTabLink';

const urlBase = `/reddit/`;

interface CommentsPageParams {
  postId?: string;
}

function CommentsPage(props: PageProps) {
  const { postId } = props.match.params as CommentsPageParams;
  console.log('Comments page .... ', props);
  const { value } = useAsync<Post>(
    async () =>
      postId ? await sendRequest(`/reddit/post/${postId}`) : Promise.resolve(),
    [postId]
  );

  if (!postId) {
    return <RequestMessage text="No post found" />;
  }

  const title = value?.title ?? '';
  const pageTitle = title ? `${title} Comments` : 'Comments';
  const queryUrl = `/reddit/post/${postId}/comments`;
  const post = (value && value.hasOwnProperty('permalink')
    ? value
    : {}) as Post;

  console.log('Comments...', value);
  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <header className="page__header">
        <h2 className="page__title">{pageTitle}</h2>
        <p className="page__subtitle">
          {post.numberOfComments ? `${post.numberOfComments} comments` : ''}
        </p>
      </header>
      <div>
        <NewTabLink
          href={`https://www.reddit.com/${post.permalink}`}
          aria-label={`View ${post.title ?? 'post'} on reddit`}
        >
          <span aria-hidden={true}>View post on reddit</span>
        </NewTabLink>
      </div>
      <Comments endpoint={queryUrl} />
    </div>
  );
}

export default CommentsPage;
