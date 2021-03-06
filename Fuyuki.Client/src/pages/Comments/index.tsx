import React from 'react';
import Helmet from 'react-helmet';

import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import NewTabLink from 'meiko/NewTabLink';
import Comments from 'src/components/Comments';
import FYKLink from 'src/components/FYKLink';
import Peekaboo from 'src/components/Peekaboo';
import PostItem from 'src/components/Posts/PostItem';
import RequestMessage from 'src/components/RequestMessage';

import { PostContext } from 'src/context';
import { useAsync } from 'src/hooks/useAsync';
import { PageProps } from 'src/interfaces/PageProps';
import { Post } from 'src/interfaces/Post';
import sendRequest from 'src/utils/sendRequest';

import './Comments.scss';

interface CommentsPageParams {
  postId?: string;
}

function CommentsPage(props: PageProps<CommentsPageParams>) {
  const { postId } = props.match.params;
  const queryParams = constructObjectFromSearchParams(props.location.search);

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
  console.log('Comments: ', queryParams);
  return (
    <div className="page">
      <Helmet title={pageTitle} />
      <Peekaboo threshold={200}>
        <div>
          {post && (
            <PostItem
              headingTag="h2"
              className="top-spacing"
              data={post}
              defaultExpanded
              lazyThumbnail={false}
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
                className="regular-link"
                href={`https://www.reddit.com/${post.permalink}`}
                aria-label={`View ${post.title ?? 'post'} on reddit`}
              >
                <span aria-hidden={true}>View post on reddit</span>
              </NewTabLink>
            </div>
          )}
        </div>
      </Peekaboo>
      <PostContext.Provider value={{ postId: post?.fullname }}>
        <Comments endpoint={queryUrl} focusedComment={queryParams.commentId} />
      </PostContext.Provider>
    </div>
  );
}

export default CommentsPage;
