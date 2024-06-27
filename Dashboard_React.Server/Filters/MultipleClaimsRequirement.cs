using Microsoft.AspNetCore.Authorization;

namespace Dashboard_React.Server.Filters
{
    public class MultipleClaimsRequirement(List<KeyValuePair<string, string>> requiredClaims)
        : IAuthorizationRequirement
    {
        public List<KeyValuePair<string, string>> RequiredClaims { get; } = requiredClaims;
    }
}
