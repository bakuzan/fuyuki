export interface UserMessage {
  permalink: string;
  created: string;
  fullname: string;
  id: string;
  author: string;
  dest: string;
  new: boolean;
  name: string;
  subject: string;
  bodyHTML: string;
  subreddit: string;
  subredditNamePrefixed: string;

  parentFullname: string;
  wasComment: boolean;

  firstMessageName: string;
  firstMessage: string;
  context: string;
}
