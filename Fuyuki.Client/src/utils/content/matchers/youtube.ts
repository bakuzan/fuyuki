import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';

function match(post: Post) {
  const embedDomains = ['twitch', 'youtube', 'youtu.be', 'vimeo'];
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
