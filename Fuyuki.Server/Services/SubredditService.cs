using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public class SubredditService : ISubredditService
    {
        private readonly IUserService _userService;
        private readonly ISubredditDataService _subredditDataService;
        private readonly IMapper _mapper;

        public SubredditService(IUserService userService,
                                ISubredditDataService subredditDataService,
                                IMapper mapper)
        {
            _userService = userService;
            _subredditDataService = subredditDataService;
            _mapper = mapper;
        }

        public async Task<List<SubredditModel>> GetSubreddits()
        {
            var items = await _subredditDataService.GetAllAsync<Subreddit>();
            return _mapper.Map<List<SubredditModel>>(items);
        }

        public async Task<List<GroupMembershipModel>> GetGroupMemberships(ClaimsPrincipal claim, string subredditName)
        {
            var user = await _userService.GetCurrentUser(claim);

            var items = await _subredditDataService.GetGroupsSubredditDtos(user.Id);
            var mapped = _mapper.Map<List<GroupMembershipModel>>(items);

            foreach (var item in mapped)
            {
                item.IsMember = items.First(x => x.Id == item.Id)
                                     .SubredditNames
                                     .Any(name => name == subredditName);
            }

            return mapped;
        }

    }
}
