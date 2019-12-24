using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IRedditService
    {
        Task<List<RedditPost>> GetRAllPage(ClaimsPrincipal claim, int page);
    }
}
