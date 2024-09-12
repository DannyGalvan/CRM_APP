using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Dashboard_React.Server.Filters;
using Entities.Configurations;
using Entities.Interfaces;
using Entities.Models;
using Entities.Response;
using Humanizer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace Dashboard_React.Server.Containers
{
    public static class JwtConfiguration
    {
        public static IServiceCollection AddJwtConfiguration(this IServiceCollection services, AppSettings appSettingsConfig, PolicySettings policySettings, MongoConnection mongoConnection)
        {
            services.AddAuthentication(d =>
            {
                d.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                d.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
               .AddJwtBearer(d =>
               {
                   byte[] key = Encoding.ASCII.GetBytes(appSettingsConfig.Secret);

                   d.RequireHttpsMetadata = false;
                   d.SaveToken = true;
                   d.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuerSigningKey = true,
                       IssuerSigningKey = new SymmetricSecurityKey(key),
                       ValidateIssuer = false,
                       ValidateAudience = false,
                   };
                   d.Events = new JwtBearerEvents
                   {
                       OnAuthenticationFailed = context =>
                       {
                           if (context.Exception.GetType() != typeof(SecurityTokenExpiredException)) return Task.CompletedTask;
                           StringValues assert = new("true");

                           context.Response.Headers.Append("Token-Expired", assert);
                           return Task.CompletedTask;
                       },
                       OnChallenge = context =>
                       {
                           context.HandleResponse();
                           context.Response.StatusCode = 401;
                           context.Response.ContentType = "application/json";

                           var result = JsonSerializer.Serialize(
                                new Response<string>()
                                {
                                    Success = false,
                                    Message = "Unauthorized, you not many authorization to path",
                                    Data = null
                                });

                           return context.Response.WriteAsync(result);
                       }
                   };
               });

            services.AddAuthorization(options =>
            {
                // Get the service from ICrmContext through the ServiceProvider
                using var scope = services.BuildServiceProvider().CreateScope();

                var bd = scope.ServiceProvider.GetRequiredService<ICrmContext>();

                var operationsCollection = bd.Database.GetCollection<Operation>(nameof(Operation).Pluralize());

                var operations = operationsCollection.Find(FilterDefinition<Operation>.Empty).ToList();

                foreach (var operation in operations)
                {
                    if (operation.Policy.Contains(policySettings.ContainsList) && operation.Policy != policySettings.NotEqualList)
                    {
                        // Add a custom policy that allows any of the claims.
                        options.AddPolicy(operation.Policy, policy =>
                        {
                            policy.Requirements.Add(new MultipleClaimsRequirement([
                                new KeyValuePair<string, string>(ClaimTypes.AuthorizationDecision, operation.Id.ToString()),
                                new KeyValuePair<string, string>(ClaimTypes.AuthorizationDecision, policySettings.EqualValue)
                            ]));
                        });
                    }
                    else
                    {
                        options.AddPolicy(operation.Policy, policy => policy.RequireClaim(claimType: ClaimTypes.AuthorizationDecision, operation.Id.ToString()));
                    }
                }
            });

            return services;
        }
    }
}
