import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';

function match(post: Post) {
  return post.url.includes('streamable');
}

async function meta(post: Post): Promise<ContentMeta> {
  const uid = post.url.split('/').slice(-1)[0];
  const src = post.url.includes('/s/')
    ? post.url
    : `https://streamable.com/s/${uid}`;

  return {
    type: ContentType.isIframe,
    src,
    defaultHeight: 350
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
