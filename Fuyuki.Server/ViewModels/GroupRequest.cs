using System.Collections.Generic;

namespace Fuyuki.ViewModels
{
    public class GroupRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<SubredditModel> Subreddits { get; set; }
    }
}
