using System;
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
        // public List<Comment> Replies { get; set; }
        // public List<Comment> replies { get; }
        public string Body { get; set; }
        public string BodyHTML { get; set; }
        public string ParentFullname { get; set; }
    }
}
