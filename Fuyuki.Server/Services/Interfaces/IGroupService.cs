using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Fuyuki.Data;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IGroupService
    {
        Task<List<GroupModel>> GetGroups(ClaimsPrincipal claim);
        Task<List<GroupSubsModel>> GetGroupsWithSubreddit(ClaimsPrincipal claim);
        Task<GroupSubsModel> GetGroupById(ClaimsPrincipal claim, int id);
        Task<GroupResponse> CreateGroup(ClaimsPrincipal claim, GroupRequest request);
        Task<GroupResponse> UpdateGroup(ClaimsPrincipal claim, GroupRequest request);
        Task<GroupResponse> DeleteGroup(ClaimsPrincipal claim, int id);
    }
}
