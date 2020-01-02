using System.Threading.Tasks;
using Reddit;

namespace Fuyuki.Managers
{
    public interface IRedditManager
    {
        Task<RedditClient> GetRedditInstance(string refreshToken, string accessToken);
    }
}
