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

        public async Task<UserModel> GetUserByName(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            return _mapper.Map<UserModel>(user);
        }

    }
}
