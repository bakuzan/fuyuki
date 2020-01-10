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
        public int Score { get; set; }
        public string Subreddit { get; set; }
        public Awards Awards { get; set; }
        public int NumberOfComments { get; set; }
        public string TextBody { get; set; }
        public string Thumbnail { get; set; }
        public bool IsSelf { get; set; }
        public bool IsVideo { get; set; }
        public string URL { get; set; }
        public string LinkFlairText { get; set; }
        public string LinkFlairType { get; set; }
        public string AuthorFlairText { get; set; }
        public string AuthorFlairType { get; set; }
        public bool Stickied { get; set; }
    }
}
