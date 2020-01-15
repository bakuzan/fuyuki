import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';

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
