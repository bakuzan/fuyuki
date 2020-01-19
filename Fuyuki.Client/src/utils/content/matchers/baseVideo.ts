/* tslint:disable:object-literal-sort-keys */
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function match(post: Post) {
  const embedDomains = [
    'twitch.tv',
    'youtube.com/watch',
    'youtu.be',
    'vimeo.com'
  ];

  return (post.url && embedDomains.some((x) => post.url.includes(x))) || false;
}

async function meta(post: Post): Promise<ContentMeta> {
  return {
    type: ContentType.isIframe,
    src: `//www.redditmedia.com/mediaembed/${post.id}`,
    defaultHeight: 350
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
