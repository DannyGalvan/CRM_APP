using Microsoft.AspNetCore.Authorization;

namespace Dashboard_React.Server.Filters
{
    public class MultipleClaimsRequirement : IAuthorizationRequirement
    {
        public MultipleClaimsRequirement(List<KeyValuePair<string, string>> requiredClaims) => RequiredClaims = requiredClaims;

        public List<KeyValuePair<string, string>> RequiredClaims { get; }
    }
}
