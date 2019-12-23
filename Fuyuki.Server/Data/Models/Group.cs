using System.Collections.Generic;

namespace Fuyuki.Data
{
    public class Group : BaseEntity<Group>
    {
        public string Name { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public List<GroupSubreddit> GroupSubreddits { get; set; }
    }
}
