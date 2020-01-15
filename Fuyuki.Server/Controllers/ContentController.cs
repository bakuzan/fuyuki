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
    public class ContentController : BaseFuyukiController
    {

        private readonly ILogger<GroupController> _logger;
        private readonly IContentService _contentService;


        public ContentController(ILogger<GroupController> logger, IContentService contentService) : base()
        {
            _logger = logger;
            _contentService = contentService;
        }

        [HttpGet]
        [Route("[action]/{contentId}")]
        public async Task<ContentResponse> Gfycat(string contentId)
        {
            return await _contentService.GetGfycatInfo(contentId);
        }

        [HttpGet]
        [Route("[action]/{contentId}")]
        public async Task<ContentResponse> Vreddit(string contentId)
        {
            return await _contentService.GetVReddit(contentId);
        }

    }
}
