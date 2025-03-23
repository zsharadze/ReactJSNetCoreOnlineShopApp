using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.BindingModels
{
    public class Register
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public bool RegisterAsAdmin { get; set; }
    }
}
