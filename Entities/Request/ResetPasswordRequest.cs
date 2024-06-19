
namespace Entities.Request
{
    public class ResetPasswordRequest
    {
        public string IdUser { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
