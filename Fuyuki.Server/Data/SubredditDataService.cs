using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Fuyuki.Data
{
    public class SubredditDataService : DataService, ISubredditDataService
    {
        private readonly DatabaseContext _context;

        public SubredditDataService(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Group>> GetGroupsSubredditBelongsTo(string subredditName)
        {
            return await _context.Groups.Include(x => x.GroupSubreddits)
                                        .ThenInclude(x => x.Subreddit)
                                        .Where(x =>
                                            x.GroupSubreddits.Any(g => g.Subreddit.Name == subredditName))
                                        .ToListAsync();
        }

    }
}
