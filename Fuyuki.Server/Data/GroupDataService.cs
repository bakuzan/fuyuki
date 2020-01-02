using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Fuyuki.Data
{
    public class GroupDataService : DataService, IGroupDataService
    {
        private readonly DatabaseContext _context;

        public GroupDataService(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Group> GetGroupAsync(int id)
        {
            return await _context.Groups
                .Include(x => x.GroupSubreddits)
                .ThenInclude(x => x.Subreddit)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Group>> GetGroups(string userId)
        {
            return await _context.Groups
                .Where(x => x.ApplicationUserId == userId)
                .ToListAsync();
        }

        public async Task<List<Group>> GetGroupsWithSubreddits(string userId)
        {
            return await _context.Groups
                .Include(x => x.GroupSubreddits)
                .ThenInclude(x => x.Subreddit)
                .Where(x => x.ApplicationUserId == userId)
                .ToListAsync();
        }
    }
}
