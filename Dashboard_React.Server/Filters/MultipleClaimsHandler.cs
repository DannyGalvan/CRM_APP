using Microsoft.AspNetCore.Authorization;

namespace Dashboard_React.Server.Filters
{
    public class MultipleClaimsHandler : AuthorizationHandler<MultipleClaimsRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, MultipleClaimsRequirement requirement)
        {
            bool hasValidClaim = requirement.RequiredClaims.Any(claim =>
                context.User.HasClaim(c => c.Type == claim.Key && c.Value == claim.Value));

            if (hasValidClaim)
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
