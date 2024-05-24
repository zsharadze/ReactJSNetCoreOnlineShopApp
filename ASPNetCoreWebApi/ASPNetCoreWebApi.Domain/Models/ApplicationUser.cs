using Microsoft.AspNetCore.Identity;

namespace ASPNetCoreWebApi.Domain.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime RegistrationDate { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
