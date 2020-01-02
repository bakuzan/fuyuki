using System.Threading.Tasks;
using Fuyuki.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Reddit;

namespace Fuyuki.Managers
{
    public class RedditManager : IRedditManager
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public RedditManager(IConfiguration configuration,
                             UserManager<ApplicationUser> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        public Task<RedditClient> GetRedditInstance(string refreshToken, string accessToken)
        {
            var reddit = new RedditClient(_configuration["RedditClientID"],
                                          refreshToken,
                                          _configuration["RedditClientSecret"],
                                          accessToken,
                                          _configuration["RedditUserAgent"]);

            return Task.FromResult(reddit);
        }
    }
}
