import { Post } from '../../interfaces/Post';

import * as matchers from './matchers';
import { ContentMatcher } from './types/ContentMatcher';
import { ContentMeta } from './types/ContentMeta';
import { ContentType } from './types/ContentType';
import { MatcherDictionary } from './types/MatcherDictionary';

const matcherDict: MatcherDictionary = matchers;
const items: ContentMatcher[] = Object.keys(matcherDict).map(
  (k: string) => matcherDict[k]
);

function contentTypeFn(type: ContentType.isNone | ContentType.isText) {
  return async (post: Post): Promise<ContentMeta> => ({ type });
}

export class ContentManager {
  public static isExpandable(post: Post) {
    const match = items.find((x) => x.match(post));
    return (post.isSelf && post.textBody !== null) || match !== undefined;
  }

  public static getContentMetaFunction(
    post: Post
  ): (post: Post) => Promise<ContentMeta> {
    if (post.isSelf) {
      return contentTypeFn(ContentType.isText);
    }

    const match = items.find((x) => x.match(post));

    return match?.meta ?? contentTypeFn(ContentType.isNone);
  }
}
