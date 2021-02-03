using System.Threading.Tasks;
using Fuyuki.Enums;
using Reddit;

namespace Fuyuki.Managers
{
    public interface IRedditManager
    {
        Task<RedditClient> GetRedditInstance(string refreshToken, string accessToken);
        string GetAccountUsername(RedditAccountName redditAccountName);
    }
}
