namespace ASPNetCoreWebApi.Models
{
    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RegisterAsAdmin { get; set; }
    }
}
