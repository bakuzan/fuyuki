using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public class GroupService : IGroupService
    {
        private readonly IGroupDataService _groupDataService;
        private readonly IMapper _mapper;

        public GroupService(IGroupDataService groupDataService, IMapper mapper)
        {
            _groupDataService = groupDataService;
            _mapper = mapper;
        }

        public async Task<GroupSubsModel> GetGroupById(int id)
        {
            var group = await _groupDataService.GetAsync<Group>(id);
            return _mapper.Map<GroupSubsModel>(group);
        }

        public async Task<List<GroupModel>> GetGroups()
        {
            var groups = await _groupDataService.GetGroups();
            return _mapper.Map<List<GroupModel>>(groups);
        }

        public async Task<List<GroupSubsModel>> GetGroupsWithSubreddit()
        {
            var groups = await _groupDataService.GetGroups();
            return _mapper.Map<List<GroupSubsModel>>(groups);
        }

        public async Task<GroupResponse> CreateGroup(GroupRequest request)
        {
            var group = _mapper.Map<Group>(request);

            foreach (var sub in request.Subreddits)
            {
                group.GroupSubreddits.Add(new GroupSubreddit
                {
                    Subreddit = _mapper.Map<Subreddit>(sub)
                });
            }

            _groupDataService.SetToPersist(group);

            await _groupDataService.SaveAsync();

            return new GroupResponse
            {
                Data = _mapper.Map<GroupModel>(group)
            };
        }

        public async Task<GroupResponse> UpdateGroup(GroupRequest request)
        {
            var group = await _groupDataService.GetAsync<Group>(request.Id);

            _mapper.Map(request, group);

            var requestSubreddits = _mapper.Map<List<Subreddit>>(request.Subreddits);
            var newSubreddits = requestSubreddits
                .Where(x => !group.GroupSubreddits.Any(g => g.SubredditId == x.Id && g.Subreddit.Name == x.Name));

            foreach (var sub in newSubreddits)
            {
                group.GroupSubreddits.Add(new GroupSubreddit
                {
                    Subreddit = sub
                });
            }

            _groupDataService.SetToPersist(group);

            await _groupDataService.SaveAsync();

            return new GroupResponse
            {
                Data = _mapper.Map<GroupModel>(group)
            };
        }

        public async Task<GroupResponse> DeleteGroup(int id)
        {
            var group = await _groupDataService.GetAsync<Group>(id, x => x.GroupSubreddits);

            _groupDataService.Delete(group);

            await _groupDataService.SaveAsync();

            return new GroupResponse();
        }
    }
}
