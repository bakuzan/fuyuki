using System;
using Reddit.Controllers.Structures;

namespace Fuyuki.ViewModels
{
    public class RedditPost
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Fullname { get; set; }
        public string Permalink { get; set; }
        public DateTime Created { get; set; }
        public DateTime Edited { get; set; }
        public bool Removed { get; set; }
        public bool Spam { get; set; }
        public bool NSFW { get; set; }
        public double UpvoteRatio { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; }
        public string Subreddit { get; set; }
        public Awards Awards { get; set; }

    }
}
