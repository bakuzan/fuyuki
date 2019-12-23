using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Fuyuki.Data
{
    public class ApplicationUser : IdentityUser
    {
        public List<Group> Groups { get; set; }
    }
}
