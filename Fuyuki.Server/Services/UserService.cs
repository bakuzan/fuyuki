using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace Fuyuki.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;

        public UserService(IMapper mapper,
                           UserManager<ApplicationUser> userManager,
                           SignInManager<ApplicationUser> signInManager)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<UserModel> GetCurrentUser(ClaimsPrincipal claim)
        {
            var userId = claim.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            var access_token = await _userManager.GetAuthenticationTokenAsync(user, "Reddit", "access_token");
            var refresh_token = await _userManager.GetAuthenticationTokenAsync(user, "Reddit", "refresh_token");

            var model = _mapper.Map<UserModel>(user);
            model.AccessToken = access_token;
            model.RefreshToken = refresh_token;

            return model;
        }
    }
}
