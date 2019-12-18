using System.Collections.Generic;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IUserService
    {
        Task<UserResponse> CreateUser(UserRequest request);
        Task<UserResponse> UpdateUser(UserRequest request);
        Task<UserResponse> ChangeUserPassword(ChangePasswordRequest request);
        Task<UserResponse> SignIn(SignInRequest request);
        Task<UserModel> GetUserByName(string username);
    }
}
