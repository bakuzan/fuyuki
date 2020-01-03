import React from 'react';

import Image from 'meiko/Image';
import NewTabLink from 'meiko/NewTabLink';
import formatDate from 'ayaka/formatDateTimeForDisplay';
import padNumber from 'ayaka/padNumber';

import FYKLink from '../FYKLink';
import AwardsBlock from '../AwardsBlock';
import { Post } from 'src/interfaces/Post';
import thousandFormat from 'src/utils/thousandFormat';

interface PostItemProps {
  index: number;
  data: Post;
}

function PostItem(props: PostItemProps) {
  const rank = `#${padNumber(props.index + 1, 2)}`;
  const x = props.data;

  const postLink = `/comments/${x.id}`;
  const hasTextBody = x.isSelf;

  // TODO
  // handle expando to display post image, video, or text
  // link to reddit directly (on comments page?)

  return (
    <li className="posts__item">
      <article className="post">
        <div className="post__rank">{rank}</div>
        <div className="post__score">{thousandFormat(x.score)}</div>
        <div>
          <Image
            className="post__thumbnail"
            src={x.thumbnail}
            alt={x.title}
            height={70}
            width={70}
            isLazy
          />
          {x.nsfw && (
            <div className="post__nsfw" aria-label="Not safe for work">
              <span aria-hidden={true}>NSFW</span>
            </div>
          )}
        </div>
        <div className="post__content">
          <header>
            <h2 className="post__title">
              <FYKLink noShadow to={postLink}>
                {x.title}
              </FYKLink>
            </h2>
          </header>
          <p className="post__submission-meta">
            Submitted at{' '}
            <time
              className="post__time"
              title={new Date(x.created).toLocaleDateString()}
              dateTime={x.created}
            >
              {formatDate(x.created)}
            </time>{' '}
            by{' '}
            <NewTabLink
              className="post__authour"
              href={`https://www.reddit.com/user/${x.author}`}
            >
              {x.author}
            </NewTabLink>{' '}
            to{' '}
            <FYKLink className="post__subreddit" to={`sub/${x.subreddit}`}>
              r/{x.subreddit}
            </FYKLink>
          </p>
          <div className="post__other">
            <FYKLink className="post__comments" to={postLink}>
              {x.numberOfComments} comments
            </FYKLink>
            <AwardsBlock data={x.awards} />
          </div>
        </div>
      </article>
    </li>
  );
}

export default React.memo(PostItem);
