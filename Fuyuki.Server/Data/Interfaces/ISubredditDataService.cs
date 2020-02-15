using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fuyuki.Data
{
    public interface ISubredditDataService : IDataService
    {
        Task<List<Group>> GetGroupsSubredditBelongsTo(string subredditName);
    }
}
