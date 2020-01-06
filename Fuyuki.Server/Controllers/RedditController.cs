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
            return await _redditService.GetSubredditPostsPaged(User, "all", lastPostId);
        }

        [HttpGet]
        [Route("Posts/Subreddit/{subName}")]
        [Route("Posts/Subreddit/{subName}/{lastPostId}")]
        public async Task<List<RedditPost>> GetPostsOnSubreddit(string subName, string lastPostId = "")
        {
            return await _redditService.GetSubredditPostsPaged(User, subName, lastPostId);
        }

        [HttpGet]
        [Route("Posts/Group/{groupId}")]
        [Route("Posts/Group/{groupId}/{lastPostId}")]
        public async Task<List<RedditPost>> GetPostsForGroup(int groupId, string lastPostId = "")
        {
            return await _redditService.GetSubredditPostsPaged(User, groupId, lastPostId);
        }

    }
}
