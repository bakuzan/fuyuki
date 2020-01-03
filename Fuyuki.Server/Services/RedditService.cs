using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<List<RedditPost>> GetRAllPostsPaged(ClaimsPrincipal claim, string lastPostId)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var posts = reddit.Subreddit("all")
                              .Posts
                              .GetHot(after: lastPostId, limit: pageSize);

            return _mapper.Map<List<RedditPost>>(posts);
        }

        public async Task<List<RedditPost>> GetSubredditPostsPaged(ClaimsPrincipal claim, int groupId, string lastPostId)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var group = await _groupDataService.GetGroupAsync(groupId);

            if (group.ApplicationUserId != user.Id)
            {
                throw new Exception("User is not permitted to use this group.");
            }

            var subNames = group.GroupSubreddits.Select(x => x.Subreddit.Name);
            var subreddits = string.Join('+', subNames);

            var posts = reddit.Subreddit(subreddits)
                              .Posts
                              .GetHot(after: lastPostId, limit: pageSize);

            return _mapper.Map<List<RedditPost>>(posts);
        }

    }
}
