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

        public async Task<List<GroupDto>> GetGroupsSubredditDtos(string userId)
        {
            return await _context.Groups.Include(x => x.GroupSubreddits)
                                        .ThenInclude(x => x.Subreddit)
                                        .Where(x => x.ApplicationUserId == userId)
                                        .Select(x => new GroupDto
                                        {
                                            Id = x.Id,
                                            Name = x.Name,
                                            SubredditNames = x.GroupSubreddits.Select(x => x.Subreddit.Name)
                                                                              .ToList()
                                        })
                                        .OrderBy(x => x.Name)
                                        .ToListAsync();
        }

        public async Task<Subreddit> GetSubredditByName(string subredditName)
        {
            return await _context.Subreddits.Where(x => x.Name == subredditName)
                                            .FirstOrDefaultAsync();
        }

    }
}
