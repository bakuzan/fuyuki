import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';

function match(post: Post) {
  return post.url.includes('v.redd.it');
}

async function meta(post: Post): Promise<ContentMeta> {
  // TODO
  // Change to display as video by querying here for the video urls...
  return {
    type: ContentType.isIframe,
    src: `//www.redditmedia.com/mediaembed/${post.id}`,
    defaultHeight: 650
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
