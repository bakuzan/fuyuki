namespace Fuyuki.Data
{
    public class SubredditDataService : DataService, ISubredditDataService
    {
        private readonly DatabaseContext _context;

        public SubredditDataService(DatabaseContext context) : base(context)
        {
            _context = context;
        }

    }
}
