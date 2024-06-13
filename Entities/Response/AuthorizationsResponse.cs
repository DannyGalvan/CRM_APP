using Entities.Models;

namespace Entities.Response
{
    public class AuthorizationsResponse
    {
        public List<Authorizations> authorizations { get; set; } = new List<Authorizations>();
        public List<UserOperation> userOperations { get; set; } = new List<UserOperation>();
    }
}
