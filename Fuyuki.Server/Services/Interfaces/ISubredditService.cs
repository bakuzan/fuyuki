using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface ISubredditService
    {
        Task<List<SubredditModel>> GetSubreddits();
        Task<List<GroupMembershipModel>> GetGroupMemberships(ClaimsPrincipal claim, string subredditName);
        Task<ToggleGroupMembershipResponse> ToggleGroupMembership(ClaimsPrincipal claim, int groupId, string subredditName);
    }
}
