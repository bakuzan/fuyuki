import { Post } from '../../../interfaces/Post';
import { ContentMeta } from './ContentMeta';

export interface ContentMatcher {
  match: (post: Post) => boolean;
  meta: (post: Post) => Promise<ContentMeta>;
}
