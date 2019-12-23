namespace Fuyuki.Data
{
    public class GroupSubreddit
    {
        public int GroupId { get; set; }
        public Group Group { get; set; }
        public int SubredditId { get; set; }
        public Subreddit Subreddit { get; set; }
    }
}
