using Microsoft.AspNetCore.Identity;

namespace Fuyuki.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string RefreshToken { get; set; }
    }
}
