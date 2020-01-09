import React from 'react';
import Helmet from 'react-helmet';

import NewTabLink from 'meiko/NewTabLink';
import Comments from 'src/components/Comments';
import RequestMessage from 'src/components/RequestMessage';
import PostContent from 'src/components/PostContent';

import { PostContext } from 'src/context';
import { useAsync } from 'src/hooks/useAsync';
import { Post } from 'src/interfaces/Post';
import { PageProps } from 'src/interfaces/PageProps';
import sendRequest from 'src/utils/sendRequest';

import './Comments.scss';
import FYKLink from 'src/components/FYKLink';
import PostItem from 'src/components/Posts/PostItem';

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

  const pageTitle = value ? `${value.title} : ${value.subreddit}` : '';
  const queryUrl = `/reddit/post/${postId}/comments`;
  const post =
    value && value.hasOwnProperty('permalink') ? (value as Post) : null;

  console.log('Comments...', value);
  return (
    <div className="page">
      <Helmet title={pageTitle} />
      {post && (
        <PostItem
          headingTag="h2"
          className="top-spacing"
          data={post}
          defaultExpanded
        />
      )}
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
      <PostContext.Provider value={{ postId: post?.fullname }}>
        <Comments endpoint={queryUrl} />
      </PostContext.Provider>
    </div>
  );
}

export default CommentsPage;
