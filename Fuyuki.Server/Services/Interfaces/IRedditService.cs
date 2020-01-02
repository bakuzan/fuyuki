using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IRedditService
    {
        Task<List<RedditPost>> GetRAllPostsPaged(ClaimsPrincipal claim, string lastPostId);

        Task<List<RedditPost>> GetSubredditPostsPaged(ClaimsPrincipal claim, int groupId, string lastPostId);
    }
}
