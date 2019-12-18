using System.Threading.Tasks;
using Fuyuki.Data;
using Microsoft.AspNetCore.Identity;
using RedditSharp;

namespace Fuyuki.Managers
{
    public class RedditManager : IRedditManager
    {
        private readonly RedditSharp.RefreshTokenWebAgentPool _webAgentPool;
        private readonly UserManager<ApplicationUser> _userManager;

        public RedditManager(RedditSharp.RefreshTokenWebAgentPool webAgentPool,
                             UserManager<ApplicationUser> userManager)
        {
            _webAgentPool = webAgentPool;
            _userManager = userManager;
        }

        public async Task<Reddit> GetRedditInstance(string username)
        {
            var webAgent = await _webAgentPool.GetOrCreateWebAgentAsync(username, async (uname, uagent, rlimit) =>
            {
                var ident = await _userManager.FindByNameAsync(username);
                return new RedditSharp.RefreshTokenPoolEntry(uname, ident.RefreshToken, rlimit, uagent);
            });

            return new RedditSharp.Reddit(webAgent, true);
        }
    }
}
