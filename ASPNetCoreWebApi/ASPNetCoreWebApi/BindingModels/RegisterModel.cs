namespace ASPNetCoreWebApi.BindingModels
{
    public class Register
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RegisterAsAdmin { get; set; }
    }
}
