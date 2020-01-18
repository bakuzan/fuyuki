/* tslint:disable:object-literal-sort-keys */
import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function match(post: Post) {
  return post.url.includes('viewkey=');
}

async function meta(post: Post): Promise<ContentMeta> {
  const params = constructObjectFromSearchParams(post.url);

  return {
    type: ContentType.isIframe,
    src: `https://www.pornhub.com/embed/${params.viewkey}`,
    defaultHeight: 350
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
