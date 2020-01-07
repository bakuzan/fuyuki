import React, { useState } from 'react';

import Image from 'meiko/Image';
import NewTabLink from 'meiko/NewTabLink';
import formatDate from 'ayaka/formatDateTimeForDisplay';
import padNumber from 'ayaka/padNumber';

import FYKLink from '../FYKLink';
import AwardsBlock from '../AwardsBlock';
import { Post } from 'src/interfaces/Post';
import thousandFormat from 'src/utils/thousandFormat';
import { Button } from 'meiko/Button';

const OPEN = `\uD83D\uDDC1\uFE0E`;

interface PostItemProps {
  index: number;
  data: Post;
}

function isImageURL(url: string) {
  return url.match(/\.(jpeg|jpg|gif|gifv|png|webp)$/) != null;
}

function PostItem(props: PostItemProps) {
  const [isExpanded, setExpanded] = useState(false);
  const rank = `#${padNumber(props.index + 1, 2)}`;
  const x = props.data;

  const postLink = `/comments/${x.id}`;
  const hasTextBody = x.isSelf;
  const isVideo = x.isVideo;
  const isImage = !x.isSelf && !x.isVideo && isImageURL(x.url);
  const isLink = !x.isSelf && !x.isVideo && !isImage;

  // TODO
  // Expando..how to show reddit hosted video/images

  return (
    <li className="posts__item">
      <article className="post">
        <div className="post__rank">{rank}</div>
        <div className="post__score">{thousandFormat(x.score)}</div>
        <div className="post__image-wrapper">
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
              <NewTabLink
                className="fyk-link fyk-link--shadowless"
                href={x.url}
              >
                {x.title}
              </NewTabLink>
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
            <FYKLink className="post__subreddit" to={`/r/posts/${x.subreddit}`}>
              r/{x.subreddit}
            </FYKLink>
          </p>
          <div className="post__actions">
            <Button
              className="post__expando"
              btnStyle="primary"
              aria-label="View post content inline"
              title="Peek"
              icon={OPEN}
              disabled={isLink}
              onClick={() => setExpanded((p) => !p)}
            />
            <div className="post__other">
              <FYKLink className="post__comments" to={postLink}>
                {x.numberOfComments} comments
              </FYKLink>
              <AwardsBlock data={x.awards} />
            </div>
          </div>
          {isExpanded && (
            <div className="post__expanded post-content">
              {hasTextBody && (
                <div className="post-content__text-body">{x.textBody}</div>
              )}
              {isImage && (
                <Image
                  className="post-content__image"
                  src={x.url}
                  alt="post content source"
                />
              )}
              {isVideo && (
                <video className="post-content__video" autoPlay controls>
                  <source src={x.url}></source>
                </video>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

export default React.memo(PostItem);
