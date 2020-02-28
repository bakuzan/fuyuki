import classNames from 'classnames';
import React, { useState } from 'react';

import formatDate from 'ayaka/formatDateTimeForDisplay';
import padNumber from 'ayaka/padNumber';
import { Button } from 'meiko/Button';
import Image from 'meiko/Image';
import NewTabLink from 'meiko/NewTabLink';

import AwardsBlock from '../AwardsBlock';
import Flair from '../FlairBlock';
import FYKLink from '../FYKLink';
import PostContent from '../PostContent';

import { Post } from 'src/interfaces/Post';
import { ContentManager } from 'src/utils/content/manager';
import hasImageExtension from 'src/utils/hasImageExtension';
import thousandFormat from 'src/utils/thousandFormat';

import './PostItem.scss';

const fykIcon = '/icon-96x96.png';
const OPEN = `\uD83D\uDDC1\uFE0E`;

interface PostItemProps {
  className?: string;
  index?: number;
  data: Post;
  defaultExpanded?: boolean;
  lazyThumbnail?: boolean;
  headingTag: keyof Pick<
    JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >;
}

const isUrl = hasImageExtension;

function PostItem(props: PostItemProps) {
  const [isExpanded, setExpanded] = useState(props.defaultExpanded ?? false);
  const Heading = props.headingTag;
  const rankNum = (props.index ?? 0) + 1;
  const rank = `#${padNumber(rankNum, 2)}`;
  const showRank = props.index !== undefined;
  const x = props.data;

  const postLabel = `Post ${rankNum}${x.stickied ? ', stickied.' : ''}`;
  const postLink = `/post/${x.fullname}/comments`;
  const canExpand = ContentManager.isExpandable(x);

  const hasThumbnail = isUrl(x.thumbnail);

  return (
    <article
      className={classNames(
        'post',
        { 'post--with-rank': showRank },
        { 'post--stickied': x.stickied },
        props.className
      )}
    >
      <div className="post__inner">
        {showRank && (
          <div className="post__rank" aria-label={postLabel} title={postLabel}>
            <span aria-hidden={true}>{rank}</span>
          </div>
        )}
        <div className="post__score">{thousandFormat(x.score)}</div>
        <div className="post__image-wrapper">
          <Image
            className="post__thumbnail"
            src={hasThumbnail ? x.thumbnail : fykIcon}
            alt={x.title}
            width={70}
            isLazy={props.lazyThumbnail ?? true}
          />
          {x.nsfw && (
            <div
              className="post__nsfw"
              aria-label="Not safe for work"
              title="Not safe for work"
            >
              <span aria-hidden={true}>NSFW</span>
            </div>
          )}
        </div>
        <div className="post__content">
          <header>
            <Heading className="post__title">
              <Flair text={x.linkFlairText} />
              <NewTabLink
                className="fyk-link fyk-link--shadowless"
                href={x.url}
              >
                {x.title}
              </NewTabLink>
            </Heading>
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
              className="regular-link post__authour"
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
              disabled={!canExpand}
              onClick={() => setExpanded((p) => !p)}
            />

            <div className="post__other">
              <FYKLink className="post__comments" to={postLink}>
                {x.numberOfComments} comments
              </FYKLink>
              <AwardsBlock data={x.awards} />
            </div>
          </div>
        </div>
      </div>
      <PostContent isExpanded={canExpand && isExpanded} data={x} />
    </article>
  );
}

export default PostItem;
