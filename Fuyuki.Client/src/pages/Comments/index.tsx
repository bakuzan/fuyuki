import React from 'react';
import Helmet from 'react-helmet';

import NewTabLink from 'meiko/NewTabLink';
import Comments from 'src/components/Comments';
import RequestMessage from 'src/components/RequestMessage';
import PostContent from 'src/components/PostContent';

import { useAsync } from 'src/hooks/useAsync';
import { Post } from 'src/interfaces/Post';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

import './Comments.scss';
import FYKLink from 'src/components/FYKLink';

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
  const pageTitle = title;
  const queryUrl = `/reddit/post/${postId}/comments`;
  const post = (value && value.hasOwnProperty('permalink')
    ? value
    : {}) as Post;

  console.log('Comments...', value);
  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <header className="page__header">
        <h2 className="page__title">
          <NewTabLink
            className="fyk-link fyk-link--shadowless"
            href={post.url ?? '#'}
          >
            {pageTitle}
          </NewTabLink>
        </h2>
      </header>
      <PostContent isExpanded={true} data={post} />
      {post && post.permalink && (
        <div className="post-info">
          <p>
            <FYKLink to={props.location.pathname}>
              {!isNaN(post.numberOfComments)
                ? `${post.numberOfComments} comments`
                : ''}
            </FYKLink>
          </p>
          <NewTabLink
            href={`https://www.reddit.com/${post.permalink}`}
            aria-label={`View ${post.title ?? 'post'} on reddit`}
          >
            <span aria-hidden={true}>View post on reddit</span>
          </NewTabLink>
        </div>
      )}
      <Comments endpoint={queryUrl} />
    </div>
  );
}

export default CommentsPage;
