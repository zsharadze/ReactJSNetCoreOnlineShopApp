using System.Security.Claims;

namespace ASPNetCoreWebApi.Extensions
{
    public static class ClaimPrincipalExtension
    {
        public static string GetCurrentUserId(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
