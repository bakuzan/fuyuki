/* tslint:disable:object-literal-sort-keys */
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function match(post: Post) {
  return post.url.includes('liveleak');
}

async function meta(post: Post): Promise<ContentMeta> {
  const query = post.url.split('?').slice(-1)[0];

  return {
    type: ContentType.isIframe,
    src: `https://www.liveleak.com/ll_embed?${query}`,
    defaultHeight: 450
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
