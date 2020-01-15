import { ContentMatcher } from './ContentMatcher';

export interface MatcherDictionary {
  [key: string]: ContentMatcher;
}
