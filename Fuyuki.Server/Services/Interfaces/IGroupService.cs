using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IGroupService
    {
        Task<List<GroupModel>> GetGroups();
        Task<GroupModel> GetGroupById(int id);
        Task<GroupResponse> CreateGroup(GroupRequest request);
        Task<GroupResponse> UpdateGroup(GroupRequest request);
        Task<GroupResponse> DeleteGroup(int id);
    }
}
