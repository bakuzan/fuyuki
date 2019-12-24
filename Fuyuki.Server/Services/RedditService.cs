using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.Managers;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public class RedditService : IRedditService
    {
        private readonly IUserService _userService;
        private readonly IRedditManager _redditManager;
        private readonly IGroupDataService _groupDataService;
        private readonly IMapper _mapper;

        private readonly int pageSize = 20;

        public RedditService(IMapper mapper,
                             IUserService userService,
                             IRedditManager redditManager,
                             IGroupDataService groupDataService)
        {
            _userService = userService;
            _redditManager = redditManager;
            _groupDataService = groupDataService;
            _mapper = mapper;
        }

        public async Task<List<RedditPost>> GetRAllPage(ClaimsPrincipal claim, int page)
        {
            var skipCount = page * pageSize;
            var user = await _userService.GetUserByName(claim.Identity.Name);

            var userToken = "";

            var reddit = await _redditManager.GetRedditInstance(userToken);
            var posts = new List<RedditPost>();

            return _mapper.Map<List<RedditPost>>(posts);
        }

    }
}
