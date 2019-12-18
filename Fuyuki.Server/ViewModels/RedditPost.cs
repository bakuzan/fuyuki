using System;

namespace Fuyuki.ViewModels
{
    public class RedditPost
    {
        public int CommentCount { get; set; }
        public bool NSFW { get; set; }
        public string SelfText { get; set; }
        public Uri Thumbnail { get; set; }
        public string Title { get; set; }
        public string SubredditName { get; set; }
        public Uri Url { get; set; }
    }
}
