import { Awards } from './Awards';
import { MoreData } from './MoreData';

export interface Comment {
  spam: boolean;
  removed: boolean;
  score: number;
  permalink: string;
  created: string;
  fullname: string;
  id: string;
  author: string;
  edited: string;
  collapsedReason: string;
  subreddit: string;
  collapsed: boolean;
  isSubmitter: boolean;
  scoreHidden: boolean;
  depth: number;
  awards: Awards;
  body: string;
  bodyHTML: string;
  parentFullname: string;
  authorFlairText?: string;
  stickied: boolean;
  distinguished?: string;
  replies?: Comment[];
  more: MoreData[];
}
