import { Subreddit } from './Subreddit';

export interface Group {
  id: number;
  name: string;
  subreddits: Subreddit[];
}
