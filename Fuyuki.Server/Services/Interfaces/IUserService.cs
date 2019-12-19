using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IUserService
    {
        Task<UserModel> GetUserByName(string username);
    }
}
