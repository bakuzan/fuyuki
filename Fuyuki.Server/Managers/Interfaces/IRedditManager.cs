using System.Threading.Tasks;

namespace Fuyuki.Managers
{
    public interface IRedditManager
    {
        Task<RedditSharp.Reddit> GetRedditInstance(string username);
    }
}
