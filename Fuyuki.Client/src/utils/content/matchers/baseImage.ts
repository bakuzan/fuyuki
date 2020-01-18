/* tslint:disable:object-literal-sort-keys */
import { Post } from '../../../interfaces/Post';
import hasImageExtension from '../../hasImageExtension';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

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
