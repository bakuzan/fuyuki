export { default as baseImage } from './baseImage';
export { default as baseVideo } from './baseVideo';
export { default as gfycat } from './gfycat';
export { default as imgur } from './imgur';
export { default as liveleak } from './liveleak';
export { default as pornhub } from './pornhub';
export { default as streamable } from './streamable';
export { default as vreddit } from './vreddit';
export { default as wikipedia } from './wikipedia';

/* Matcher template
*

// tslint:disable:object-literal-sort-keys 
import { Post } from '../../../interfaces/Post';
import { ContentMatcher } from '../types/ContentMatcher';
import { ContentMeta } from '../types/ContentMeta';
import { ContentType } from '../types/ContentType';

function match(post: Post) {
  return false;
}

async function meta(post: Post): Promise<ContentMeta> {
  return {
    type: ContentType.isNone
  };
}

const matcher: ContentMatcher = {
  match,
  meta
};

export default matcher;

*
*/
