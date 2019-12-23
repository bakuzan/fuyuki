using System.Collections.Generic;

namespace Fuyuki.Data
{
    public class Subreddit : BaseEntity<Subreddit>
    {
        public string Name { get; set; }
        public List<GroupSubreddit> GroupSubreddits { get; set; }
    }
}
