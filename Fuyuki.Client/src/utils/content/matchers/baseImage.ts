import hasImageExtension from '../../hasImageExtension';
import { ContentType } from '../types/ContentType';
import { Post } from '../../../interfaces/Post';
import { ContentMeta } from '../types/ContentMeta';
import { ContentMatcher } from '../types/ContentMatcher';

function match(post: Post) {
  const imgurGifv = post.url.includes('imgur') && post.url.includes('.gifv');
  return hasImageExtension(post.url) && !imgurGifv;
}

async function meta(post: Post): Promise<ContentMeta> {
  return {
    type: ContentType.isImage,
    src: post.url
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;
