using System.Collections.Generic;
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

        public async Task<List<Group>> GetGroups()
        {
            return await _context.Groups.ToListAsync();
        }
    }
}
