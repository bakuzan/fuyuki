using System.Security.Claims;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IUserService
    {
        Task<UserModel> GetCurrentUser(ClaimsPrincipal claim);
    }
}
