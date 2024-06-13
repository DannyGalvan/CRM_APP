

namespace Entities.Response
{
    public class AuthResponse
    {
        public string Name { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public bool Redirect { get; set; }
        public string UserId { get; set; } = string.Empty;

        public ICollection<Authorizations> Operations { get; set; } = new List<Authorizations>();
    }
}
