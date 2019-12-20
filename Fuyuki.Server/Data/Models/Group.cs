using System.Collections.Generic;

namespace Fuyuki.Data
{
    public class Group : BaseEntity<Group>
    {
        public string Name { get; set; }
        public List<Subreddit> Subreddits { get; set; }
    }
}
