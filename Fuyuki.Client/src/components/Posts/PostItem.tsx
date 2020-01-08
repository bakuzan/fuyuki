import classNames from 'classnames';
import React, { useState } from 'react';

import { Button } from 'meiko/Button';
import Image from 'meiko/Image';
import NewTabLink from 'meiko/NewTabLink';
import formatDate from 'ayaka/formatDateTimeForDisplay';
import padNumber from 'ayaka/padNumber';

import FYKLink from '../FYKLink';
import AwardsBlock from '../AwardsBlock';
import Flair from '../FlairBlock';
import PostContent from '../PostContent';
import { Post } from 'src/interfaces/Post';
import thousandFormat from 'src/utils/thousandFormat';
import isImageURL from 'src/utils/isImageURL';
import isIframeContent from 'src/utils/isIframeContent';

const OPEN = `\uD83D\uDDC1\uFE0E`;

interface PostItemProps {
  index: number;
  data: Post;
}

function PostItem(props: PostItemProps) {
  const [isExpanded, setExpanded] = useState(false);
  const rankNum = props.index + 1;
  const rank = `#${padNumber(rankNum, 2)}`;
  const x = props.data;

  const postLabel = `Post ${rankNum}${x.stickied ? ', stickied.' : ''}`;
  const postLink = `/post/${x.fullname}/comments`;

  const isImage = !x.isSelf && !x.isVideo && isImageURL(x.url);
  const isIframe = !x.isSelf && !isImage && isIframeContent(x.url);
  const isLink = !x.isSelf && !x.isVideo && !isImage && !isIframe;

  return (
    <li className="posts__item">
      <article className={classNames('post', { 'post--stickied': x.stickied })}>
        <div className="post__rank" aria-label={postLabel} title={postLabel}>
          <span aria-hidden={true}>{rank}</span>
        </div>
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
              <Flair text={x.linkFlairText} />
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
              title={`${new Date(x.created).toLocaleDateString()} ${new Date(
                x.created
              ).toLocaleTimeString()}`}
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
            </NewTabLink>
            <Flair text={x.authorFlairText} />
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
          <PostContent isExpanded={isExpanded} data={x} />
        </div>
      </article>
    </li>
  );
}

export default React.memo(PostItem);
