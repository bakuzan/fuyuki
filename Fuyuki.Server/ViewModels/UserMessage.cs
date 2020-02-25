using System;

namespace Fuyuki.ViewModels
{
    public class UserMessage
    {
        public DateTime Created { get; set; }
        public string Name { get; set; }
        public string BodyHTML { get; set; }
        public string Dest { get; set; }
        public bool New { get; set; }
        public string SubredditNamePrefixed { get; set; }
        public string ParentId { get; set; }
        public string Author { get; set; }
        public bool WasComment { get; set; }
        public string Subject { get; set; }
        public string Fullname { get; }
        public string Id { get; set; }
        public object Replies { get; set; }
        public string Subreddit { get; set; }
        public string FirstMessageName { get; set; }
        public string FirstMessage { get; set; }
        public string Context { get; set; }
    }
}
