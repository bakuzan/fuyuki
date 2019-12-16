using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;
using Fuyuki.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Fuyuki.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupController : ControllerBase
    {

        private readonly ILogger<GroupController> _logger;
        private readonly IGroupService _groupService;

        public GroupController(ILogger<GroupController> logger, IGroupService groupService)
        {
            _logger = logger;
            _groupService = groupService;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<GroupModel>> GetAll()
        {
            return await _groupService.GetGroups();
        }

        [HttpGet("{id}")]
        public async Task<GroupModel> Get(int id)
        {
            return await _groupService.GetGroupById(id);
        }
    }
}
