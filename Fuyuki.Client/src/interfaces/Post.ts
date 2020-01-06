export interface Awards {
  silver: number;
  gold: number;
  platinum: number;
  count: number;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  fullname: string;
  permalink: string;
  created: string;
  edited: string;
  removed: boolean;
  spam: boolean;
  nsfw: boolean;
  score: number;
  upvoteRatio: number;
  upVotes: number;
  downVotes: number;
  subreddit: string;
  awards: Awards;
  numberOfComments: number;
  textBody: string;
  thumbnail: string;
  isSelf: boolean;
  isVideo: boolean;
  url: string;
}