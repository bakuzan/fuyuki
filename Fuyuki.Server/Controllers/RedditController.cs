using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;
using Fuyuki.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Fuyuki.Managers;
using System.Linq;
using AutoMapper;
using static RedditSharp.Things.Subreddit;
using Microsoft.AspNetCore.Authorization;

namespace Fuyuki.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class RedditController : BaseFuyukiController
    {

        private readonly ILogger<RedditController> _logger;
        private readonly IMapper _mapper;
        private readonly IRedditManager _redditManager;
        private readonly IGroupService _groupService;

        private readonly int pageSize = 20;

        public RedditController(ILogger<RedditController> logger,
                                IMapper mapper,
                                IRedditManager redditManager,
                                IGroupService groupService) : base()
        {
            _logger = logger;
            _mapper = mapper;
            _redditManager = redditManager;
            _groupService = groupService;
        }

        [HttpGet]
        [Route("[action]")]
        [Route("[action]/{page}")]
        public async Task<List<RedditPost>> GetRAll(int page = 0)
        {
            var skipCount = page * pageSize;
            var username = User.Identity.Name;

            var reddit = await _redditManager.GetRedditInstance(username);
            var sub = await reddit.GetSubredditAsync("r/all");
            var posts = await sub.GetPosts(Sort.New, -1)
                .Skip(skipCount)
                .Take(20)
                .ToList();

            return _mapper.Map<List<RedditPost>>(posts);
        }

    }
}