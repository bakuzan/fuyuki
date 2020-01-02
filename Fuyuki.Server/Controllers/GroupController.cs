using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;
using Fuyuki.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace Fuyuki.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GroupController : BaseFuyukiController
    {

        private readonly ILogger<GroupController> _logger;
        private readonly IGroupService _groupService;

        public GroupController(ILogger<GroupController> logger, IGroupService groupService) : base()
        {
            _logger = logger;
            _groupService = groupService;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<GroupModel>> GetAll()
        {
            return await _groupService.GetGroups(User);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<GroupSubsModel>> GetAllWithSubreddits()
        {
            return await _groupService.GetGroupsWithSubreddit(User);
        }

        [HttpGet("{id}")]
        public async Task<GroupModel> Get(int id)
        {
            return await _groupService.GetGroupById(User, id);
        }

        [HttpPost]
        public async Task<GroupResponse> Post(GroupRequest request)
        {
            return await _groupService.CreateGroup(User, request);
        }

        [HttpPut]
        public async Task<GroupResponse> Put(GroupRequest request)
        {
            return await _groupService.UpdateGroup(User, request);
        }

        [HttpDelete("{id}")]
        public async Task<GroupResponse> Delete(int id)
        {
            return await _groupService.DeleteGroup(User, id);
        }
    }
}
