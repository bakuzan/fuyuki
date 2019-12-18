using System.Linq;
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

        #region User Methods

        public async Task<UserResponse> CreateUser(UserRequest request)
        {
            var response = new UserResponse();
            var newUser = _mapper.Map<ApplicationUser>(request);

            var result = await _userManager.CreateAsync(newUser);

            if (!result.Succeeded)
            {
                response.ErrorMessages.AddRange(result.Errors.Select(x => x.Description));
            }

            return response;
        }

        public async Task<UserResponse> UpdateUser(UserRequest request)
        {
            var response = new UserResponse();

            var user = await _userManager.FindByIdAsync(request.Id);
            _mapper.Map(request, user);

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                response.ErrorMessages.AddRange(result.Errors.Select(x => x.Description));
            }

            return response;
        }

        public async Task<UserResponse> ChangeUserPassword(ChangePasswordRequest request)
        {
            var response = new UserResponse();

            var user = await _userManager.FindByIdAsync(request.Id);

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                response.ErrorMessages.AddRange(result.Errors.Select(x => x.Description));
            }

            return response;
        }

        #endregion

        #region Sign In Methods

        public async Task<UserResponse> SignIn(SignInRequest request)
        {
            var response = new UserResponse();

            var user = await _userManager.FindByNameAsync(request.UserName);
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!result.Succeeded)
            {
                var errorMessage = "Unable to sign in.";

                if (result.IsLockedOut)
                    errorMessage = "User is locked out.";

                if (result.IsNotAllowed)
                    errorMessage = "Username or password is incorrect.";

                response.ErrorMessages.Add(errorMessage);
            }

            return response;
        }

        public async Task<UserModel> GetUserByName(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            return _mapper.Map<UserModel>(user);
        }

        #endregion

    }
}
