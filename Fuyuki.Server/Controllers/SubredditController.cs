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

    }
}
