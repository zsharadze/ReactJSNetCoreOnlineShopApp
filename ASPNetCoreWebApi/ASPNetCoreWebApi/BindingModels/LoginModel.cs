using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.BindingModels
{
    public class Login
    {
        [Required]
        [EmailAddress]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
