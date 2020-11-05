/* tslint:disable:object-literal-sort-keys */
import videoExtensions from 'video-extensions';

import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function isDomainMatch(post: Post) {
  const embedDomains = [
    'twitch.tv',
    'youtube.com/watch',
    'youtu.be',
    'vimeo.com'
  ];

  return (post.url && embedDomains.some((x) => post.url.includes(x))) || false;
}

function isExtensionMatch(post: Post) {
  const vidExts = new Set(videoExtensions);
  const ext = post.url.split('.').pop() ?? '';
  return vidExts.has(ext);
}

function match(post: Post) {
  return isDomainMatch(post) || isExtensionMatch(post);
}

async function meta(post: Post): Promise<ContentMeta> {
  if (isDomainMatch(post)) {
    return {
      type: ContentType.isIframe,
      src: `//www.redditmedia.com/mediaembed/${post.id}`,
      defaultHeight: 350
    };
  } else {
    // Should never be empty string, but typescript complains.
    const ext = post.url.split('.').pop() ?? '';

    return {
      type: ContentType.isVideo,
      sources: [{ src: post.url, type: `video/${ext}` }]
    };
  }
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
