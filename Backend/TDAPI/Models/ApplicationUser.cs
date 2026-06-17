using Microsoft.AspNetCore.Identity;

namespace TDAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? DisplayName { get; set; }
    }
}
