/* tslint:disable:object-literal-sort-keys */
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

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
