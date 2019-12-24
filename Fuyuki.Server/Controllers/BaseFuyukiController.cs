using Microsoft.AspNetCore.Mvc;

namespace Fuyuki.Controllers
{
    [ApiController]
    public abstract class BaseFuyukiController : ControllerBase
    {
        protected BaseFuyukiController()
        { }
    }
}
