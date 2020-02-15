using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public class SubredditService : ISubredditService
    {
        private readonly ISubredditDataService _subredditDataService;
        private readonly IMapper _mapper;

        public SubredditService(ISubredditDataService subredditDataService, IMapper mapper)
        {
            _subredditDataService = subredditDataService;
            _mapper = mapper;
        }

        public async Task<List<SubredditModel>> GetSubreddits()
        {
            var items = await _subredditDataService.GetAllAsync<Subreddit>();
            return _mapper.Map<List<SubredditModel>>(items);
        }

        public async Task<List<GroupModel>> GetMemberships(string subredditName)
        {
            var items = await _subredditDataService.GetGroupsSubredditBelongsTo(subredditName);
            return _mapper.Map<List<GroupModel>>(items);
        }

    }
}
