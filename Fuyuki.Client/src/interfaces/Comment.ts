import { Awards } from './Awards';

export interface Comment {
  spam: boolean;
  removed: boolean;
  downVotes: number;
  upVotes: number;
  score: number;
  permalink: string;
  created: string;
  fullname: string;
  id: string;
  author: string;
  edited: string;
  parentId: string;
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
  replies: Comment[];
}
