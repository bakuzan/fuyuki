using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Fuyuki.Enums;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IRedditService
    {
        Task<RedditUser> GetCurrentRedditUser(ClaimsPrincipal claim);
        Task<List<RedditPost>> GetSubredditPostsPaged(ClaimsPrincipal claim, string subName, string lastPostId);
        Task<List<RedditPost>> GetSubredditPostsPaged(ClaimsPrincipal claim, int groupId, string lastPostId);
        Task<RedditPost> GetRedditPost(ClaimsPrincipal claim, string postId);
        Task<List<RedditComment>> GetPostCommentsPaged(ClaimsPrincipal claim, string postId, string lastPostId);
        Task<List<RedditComment>> GetMoreComments(ClaimsPrincipal claim, string postId, List<string> commentIds);
        Task<RequestVideoResponse> RequestVredditDownload(ClaimsPrincipal claim, string url);
        Task<List<RedditSearchResult>> SearchSubreddits(ClaimsPrincipal claim, string searchText);
        Task<List<RedditSearchResult>> SearchPosts(ClaimsPrincipal claim, string subredditName, string searchText, RedditSort sort);

    }
}
