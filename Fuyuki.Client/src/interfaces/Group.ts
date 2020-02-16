import { Subreddit } from './Subreddit';

export interface Group {
  id: number;
  name: string;
}

export interface GroupWithSubreddits extends Group {
  subreddits: Subreddit[];
}

export interface GroupMembership extends Group {
  isMember: boolean;
}
