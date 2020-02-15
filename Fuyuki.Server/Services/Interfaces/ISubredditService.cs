using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface ISubredditService
    {
        Task<List<SubredditModel>> GetSubreddits();
        Task<List<GroupModel>> GetMemberships(string subredditName);
    }
}
