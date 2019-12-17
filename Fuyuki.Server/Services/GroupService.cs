using System.Collections.Generic;
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

        public async Task<GroupModel> GetGroupById(int id)
        {
            var group = await _groupDataService.GetAsync<Group>(id);
            return _mapper.Map<GroupModel>(group);
        }

        public async Task<List<GroupModel>> GetGroups()
        {
            var groups = await _groupDataService.GetGroups();
            return _mapper.Map<List<GroupModel>>(groups);
        }

        public Task<GroupModel> CreateGroup(GroupRequest request)
        {
            throw new System.NotImplementedException();
        }

        public Task<GroupModel> SaveGroup(GroupRequest request)
        {
            throw new System.NotImplementedException();
        }
    }
}
