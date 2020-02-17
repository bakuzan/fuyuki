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
    public class SubredditController : BaseFuyukiController
    {

        private readonly ILogger<GroupController> _logger;
        private readonly ISubredditService _subredditService;

        public SubredditController(ILogger<GroupController> logger, ISubredditService subredditService) : base()
        {
            _logger = logger;
            _subredditService = subredditService;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<SubredditModel>> GetAll()
        {
            return await _subredditService.GetSubreddits();
        }

        [HttpGet]
        [Route("[action]/{subredditName}")]
        public async Task<List<GroupMembershipModel>> GetGroupMemberships(string subredditName)
        {
            return await _subredditService.GetGroupMemberships(User, subredditName);
        }

        [HttpPut]
        [Route("[action]/{groupId}/{subredditName}")]
        public async Task<ToggleGroupMembershipResponse> ToggleGroupMembership(int groupId, string subredditName)
        {
            return await _subredditService.ToggleGroupMembership(User, groupId, subredditName);
        }

    }
}
