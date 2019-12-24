using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Fuyuki.Controllers
{
    public abstract class BaseFuyukiController : ControllerBase
    {
        protected BaseFuyukiController()
        { }

        public string GetUserName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
