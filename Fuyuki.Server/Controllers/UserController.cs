using Fuyuki.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using System.Threading.Tasks;
using Fuyuki.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace Fuyuki.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : BaseFuyukiController
    {

        private readonly ILogger<UserController> _logger;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public UserController(ILogger<UserController> logger,
                                IMapper mapper,
                                IUserService userService) : base()
        {
            _logger = logger;
            _mapper = mapper;
            _userService = userService;
        }


        [HttpGet]
        public async Task<UserModel> Get()
        {
            return await _userService.GetCurrentUser(User);
        }

    }
}
