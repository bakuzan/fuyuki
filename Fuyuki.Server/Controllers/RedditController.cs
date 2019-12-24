using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;
using Fuyuki.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace Fuyuki.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class RedditController : BaseFuyukiController
    {

        private readonly ILogger<RedditController> _logger;
        private readonly IRedditService _redditService;

        public RedditController(ILogger<RedditController> logger, IRedditService redditService) : base()
        {
            _logger = logger;
            _redditService = redditService;
        }

        [HttpGet]
        [Route("[action]")]
        [Route("[action]/{page}")]
        public async Task<List<RedditPost>> GetRAll(int page = 0)
        {
            return await _redditService.GetSubredditPostsPaged(User, "all", page);
        }

    }
}
