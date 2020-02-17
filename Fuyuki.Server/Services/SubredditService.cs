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
        private readonly IGroupDataService _groupDataService;
        private readonly ISubredditDataService _subredditDataService;
        private readonly IMapper _mapper;

        public SubredditService(IUserService userService,
                                IGroupDataService groupDataService,
                                ISubredditDataService subredditDataService,
                                IMapper mapper)
        {
            _userService = userService;
            _groupDataService = groupDataService;
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

        public async Task<ToggleGroupMembershipResponse> ToggleGroupMembership(ClaimsPrincipal claim,
                                                                               int groupId,
                                                                               string subredditName)
        {
            var user = await _userService.GetCurrentUser(claim);

            var response = new ToggleGroupMembershipResponse();
            var group = await _groupDataService.GetGroupAsync(groupId);

            if (group.ApplicationUserId != user.Id)
            {
                response.ErrorMessages.Add("The group selected is not associated to the current user.");
                return response;
            }

            var subreddit = await _subredditDataService.GetSubredditByName(subredditName);

            if (subreddit == null)
            {
                subreddit = new Subreddit { Name = subredditName };
            }

            if (!group.GroupSubreddits.Any(g => g.SubredditId == subreddit.Id))
            {
                group.GroupSubreddits.Add(new GroupSubreddit
                {
                    GroupId = group.Id,
                    Subreddit = subreddit
                });
            }
            else
            {
                group.GroupSubreddits.RemoveAll(g => g.SubredditId == subreddit.Id);
            }

            _subredditDataService.SetToPersist(group);

            await _subredditDataService.SaveAsync();

            return response;
        }

    }
}
