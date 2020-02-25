using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.Enums;
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
            var comments = post.Comments.GetComments(sort: "best");

            var listings = comments.Select(x => x.Listing);
            var mapped = _mapper.Map<List<RedditComment>>(listings);
            return mapped;
        }

        public async Task<List<RedditComment>> GetMoreComments(ClaimsPrincipal claim, string postId, List<string> commentIds)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var idString = string.Join(',', commentIds.Take(100));
            var children = reddit.Models.LinksAndComments.MoreChildren(
                new Reddit.Inputs.LinksAndComments.LinksAndCommentsMoreChildrenInput(linkId: postId, children: idString));

            var mapped = _mapper.Map<List<RedditComment>>(children.Comments);

            foreach (var item in mapped)
            {
                if (item.Replies == null)
                    item.Replies = new List<RedditComment>();

                item.Replies.AddRange(
                    mapped.Where(x => x.ParentFullname == item.Fullname)
                          .OrderByDescending(x => x.Score)
                          .ThenByDescending(x => x.Created)
                          .ToList());
            }

            var minDepth = mapped.Select(x => x.Depth).Min();
            var result = mapped.Where(x => x.Depth == minDepth).ToList();

            return result;
        }

        public async Task<RequestVideoResponse> RequestVredditDownload(ClaimsPrincipal claim, string url)
        {
            var response = new RequestVideoResponse();

            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var message = new Reddit.Inputs.PrivateMessages.PrivateMessagesComposeInput(
                subject: "Reddit video request",
                text: $"https://www.reddit.com{url}",
                to: "VredditDownloader"
            );

            try
            {
                await reddit.Models.PrivateMessages.ComposeAsync(message);
            }
            catch (Exception e)
            {
                response.ErrorMessages.Add(e.Message);
            }

            return response;
        }

        public async Task<List<RedditSearchResult>> SearchSubreddits(ClaimsPrincipal claim, string searchText)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var subreddits = reddit.SearchSubreddits(searchText);

            return _mapper.Map<List<RedditSearchResult>>(subreddits);
        }

        public async Task<List<RedditSearchResult>> SearchPosts(ClaimsPrincipal claim,
                                                                string subreddit,
                                                                string searchText,
                                                                RedditSort sort)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var searchParams = new Reddit.Inputs.Search.SearchGetSearchInput(q: searchText, sort: TranslateSortEnum(sort));
            var posts = reddit.Subreddit(subreddit)
                              .Search(searchParams);

            return _mapper.Map<List<RedditSearchResult>>(posts);
        }

        public async Task<List<UserMessage>> GetUserMessages(ClaimsPrincipal claim, string where)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            var input = new Reddit.Inputs.PrivateMessages.PrivateMessagesGetMessagesInput();
            var container = reddit.Models.PrivateMessages.GetMessages(where, input);

            var messages = container.Data.Children.Select(x => x.Data);

            return _mapper.Map<List<UserMessage>>(messages);
        }

        public async Task<MarkAsReadResponse> MarkUserMessageAsRead(ClaimsPrincipal claim, MarkAsReadRequest request)
        {
            var user = await _userService.GetCurrentUser(claim);
            var reddit = await _redditManager.GetRedditInstance(user.RefreshToken, user.AccessToken);

            await reddit.Models.PrivateMessages.ReadMessageAsync(request.MessageId);

            return new MarkAsReadResponse();
        }

        #region Private methods

        private string TranslateSortEnum(RedditSort sort)
        {
            switch (sort)
            {
                case RedditSort.New:
                    return Constants.RedditSort.New;
                case RedditSort.Relevance:
                default:
                    return Constants.RedditSort.Relevance;
            }
        }

        #endregion

    }
}
