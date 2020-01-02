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
        [Route("Posts")]
        [Route("Posts/{lastPostId}")]
        public async Task<List<RedditPost>> GetPostsOnRAll(string lastPostId = "")
        {
            return await _redditService.GetRAllPostsPaged(User, lastPostId);
        }

        [HttpGet]
        [Route("{groupId}/Posts")]
        [Route("{groupId}/Posts/{lastPostId}")]
        public async Task<List<RedditPost>> GetPosts(int groupId, string lastPostId = "")
        {
            return await _redditService.GetSubredditPostsPaged(User, groupId, lastPostId);
        }

    }
}
