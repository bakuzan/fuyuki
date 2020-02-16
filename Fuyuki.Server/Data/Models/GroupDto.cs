using System.Collections.Generic;

namespace Fuyuki.Data
{
    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<string> SubredditNames { get; set; }
    }
}
