using System.Collections.Generic;

namespace Fuyuki.ViewModels
{
    public class GroupModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class GroupSubsModel : GroupModel
    {
        public List<SubredditModel> Subreddits { get; set; }
    }
}
