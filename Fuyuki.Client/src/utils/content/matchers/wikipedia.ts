import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';

function match(post: Post) {
  return post.url.includes('wikipedia');
}

async function meta(post: Post): Promise<ContentMeta> {
  return {
    type: ContentType.isIframe,
    src: post.url,
    scrollable: 'yes',
    defaultHeight: 600
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
