using System;
using System.Collections.Generic;
using Reddit.Controllers.Structures;

namespace Fuyuki.ViewModels
{
    public class RedditComment
    {
        public bool Spam { get; set; }
        public bool Removed { get; set; }
        public int DownVotes { get; set; }
        public int UpVotes { get; set; }
        public int Score { get; set; }
        public string Permalink { get; set; }
        public DateTime Created { get; set; }
        public string Fullname { get; set; }
        public string Id { get; set; }
        public string Author { get; set; }
        public DateTime Edited { get; set; }
        public string ParentId { get; set; }
        public string CollapsedReason { get; set; }
        public string Subreddit { get; set; }
        public bool Collapsed { get; set; }
        public bool IsSubmitter { get; set; }
        public bool ScoreHidden { get; set; }
        public int Depth { get; set; }
        public Awards Awards { get; set; }
        public string Body { get; set; }
        public string BodyHTML { get; set; }
        public string ParentFullname { get; set; }
        public string AuthorFlairText { get; set; }
        public string Distinguished { get; set; }
        public bool Stickied { get; set; }
        public List<RedditComment> Replies { get; set; }
        public List<Reddit.Things.More> More { get; set; }
    }
}
