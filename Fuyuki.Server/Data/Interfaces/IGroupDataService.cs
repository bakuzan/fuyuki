using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fuyuki.Data
{
    public interface IGroupDataService : IDataService
    {
        Task<List<Group>> GetGroups(string userId);
        Task<List<Group>> GetGroupsWithSubreddits(string userId);
    }
}
