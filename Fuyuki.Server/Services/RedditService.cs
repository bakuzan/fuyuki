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

        private readonly int postsPageSize = 25;
        private readonly int commentsLimit = 25;

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

        public async Task<RedditUser> GetCurrentRedditUser(ClaimsPrincipal claim)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            return _mapper.Map<RedditUser>(reddit.Account.Me);
        }

        public async Task<List<RedditPost>> GetSubredditPostsPaged(ClaimsPrincipal claim, string subName, string lastPostId)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var posts = reddit.Subreddit(subName)
                              .Posts
                              .GetHot(after: lastPostId, limit: postsPageSize);

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
                              .GetHot(after: lastPostId, limit: postsPageSize);

            return _mapper.Map<List<RedditPost>>(posts);
        }

        public async Task<RedditPost> GetRedditPost(ClaimsPrincipal claim, string postId)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);
            var post = reddit.Post(postId).About();

            return _mapper.Map<RedditPost>(post);
        }

        public async Task<List<RedditComment>> GetPostCommentsPaged(ClaimsPrincipal claim, string postId, string lastPostId)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var post = reddit.Post(postId).About();
            var comments = post.Comments.GetComments(sort: "best",
                                                     depth: 0,
                                                     showMore: true,
                                                     limit: commentsLimit);

            var watch = System.Diagnostics.Stopwatch.StartNew();
            var mapped = _mapper.Map<List<RedditComment>>(comments);
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;

            return mapped;
        }

        public async Task<List<RedditComment>> GetMoreComments(ClaimsPrincipal claim, string postId, List<string> commentIds)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var idString = string.Join(',', commentIds);
            var children = reddit.Models.LinksAndComments.MoreChildren(
                new Reddit.Inputs.LinksAndComments.LinksAndCommentsMoreChildrenInput(linkId: postId, children: idString));

            var comments = children.Comments;

            var watch = System.Diagnostics.Stopwatch.StartNew();
            var mapped = _mapper.Map<List<RedditComment>>(comments);
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;

            return mapped;
        }

    }
}
