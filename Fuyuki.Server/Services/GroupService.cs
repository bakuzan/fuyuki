using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace Fuyuki.Services
{
    public class GroupService : IGroupService
    {
        private readonly IUserService _userService;
        private readonly IGroupDataService _groupDataService;
        private readonly IMapper _mapper;

        public GroupService(IUserService userService,
                            IGroupDataService groupDataService,
                            IMapper mapper)
        {
            _userService = userService;
            _groupDataService = groupDataService;
            _mapper = mapper;
        }

        public async Task<GroupSubsModel> GetGroupById(ClaimsPrincipal claim, int id)
        {
            var user = await _userService.GetCurrentUser(claim);
            var group = await _groupDataService.GetGroupAsync(id);

            if (group.ApplicationUserId != user.Id)
            {
                throw new Exception("User is not authourised to view this group.");
            }

            return _mapper.Map<GroupSubsModel>(group);
        }

        public async Task<List<GroupModel>> GetGroups(ClaimsPrincipal claim)
        {
            var user = await _userService.GetCurrentUser(claim);
            var groups = await _groupDataService.GetGroups(user.Id);
            return _mapper.Map<List<GroupModel>>(groups)
                          .OrderBy(x => x.Name)
                          .ToList();
        }

        public async Task<List<GroupSubsModel>> GetGroupsWithSubreddit(ClaimsPrincipal claim)
        {
            var user = await _userService.GetCurrentUser(claim);
            var groups = await _groupDataService.GetGroupsWithSubreddits(user.Id);
            return _mapper.Map<List<GroupSubsModel>>(groups)
                          .OrderBy(x => x.Name)
                          .ToList();
        }

        public async Task<GroupResponse> CreateGroup(ClaimsPrincipal claim, GroupRequest request)
        {
            var response = new GroupResponse();
            var user = await _userService.GetCurrentUser(claim);

            var group = _mapper.Map<Group>(request);
            group.ApplicationUserId = user.Id;

            if (string.IsNullOrEmpty(group.Name))
            {
                response.ErrorMessages.Add("Group name is required");
                return response;
            }

            _groupDataService.SetToPersist(group);

            await _groupDataService.SaveAsync();

            if (group.GroupSubreddits == null)
            {
                group.GroupSubreddits = new List<GroupSubreddit>();
            }

            var subreddits = request.Subreddits.Where(x => !string.IsNullOrEmpty(x.Name));
            foreach (var sub in subreddits)
            {
                group.GroupSubreddits.Add(new GroupSubreddit
                {
                    Group = group,
                    Subreddit = _mapper.Map<Subreddit>(sub)
                });
            }

            _groupDataService.SetToPersist(group);

            await _groupDataService.SaveAsync();

            response.Data = _mapper.Map<GroupModel>(group);
            return response;
        }

        public async Task<GroupResponse> UpdateGroup(ClaimsPrincipal claim, GroupRequest request)
        {
            var response = new GroupResponse();
            var user = await _userService.GetCurrentUser(claim);
            var group = await _groupDataService.GetGroupAsync(request.Id);

            if (group.ApplicationUserId != user.Id)
            {
                return new GroupResponse
                {
                    ErrorMessages = new List<string> { "The group selected is not associated to the current user." }
                };
            }

            _mapper.Map(request, group);

            if (string.IsNullOrEmpty(group.Name))
            {
                response.ErrorMessages.Add("Group name is required");
                return response;
            }

            if (group.GroupSubreddits == null)
            {
                group.GroupSubreddits = new List<GroupSubreddit>();
            }

            var requestSubreddits = _mapper.Map<List<Subreddit>>(request.Subreddits);

            group.GroupSubreddits.RemoveAll(g =>
                !requestSubreddits.Any(r => g.SubredditId == r.Id && g.Subreddit.Name == r.Name));

            var newSubreddits = requestSubreddits.Where(x =>
                !group.GroupSubreddits.Any(g => g.SubredditId == x.Id && g.Subreddit.Name == x.Name));

            var subreddits = newSubreddits.Where(x => !string.IsNullOrEmpty(x.Name));
            foreach (var sub in newSubreddits)
            {
                group.GroupSubreddits.Add(new GroupSubreddit
                {
                    GroupId = group.Id,
                    Subreddit = sub
                });
            }

            _groupDataService.SetToPersist(group);

            await _groupDataService.SaveAsync();

            response.Data = _mapper.Map<GroupModel>(group);
            return response;
        }

        public async Task<GroupResponse> DeleteGroup(ClaimsPrincipal claim, int id)
        {
            var user = await _userService.GetCurrentUser(claim);
            var group = await _groupDataService.GetGroupAsync(id);

            if (group.ApplicationUserId != user.Id)
            {
                return new GroupResponse
                {
                    ErrorMessages = new List<string> { "The group selected is not associated to the current user and could not be deleted." }
                };
            }

            _groupDataService.Delete(group);

            await _groupDataService.SaveAsync();

            return new GroupResponse();
        }
    }
}
