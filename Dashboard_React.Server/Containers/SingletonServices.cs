using Business.Mappers;
using Dashboard_React.Server.Filters;
using Microsoft.AspNetCore.Authorization;

namespace Dashboard_React.Server.Containers
{
    public static class SingletonServices
    {
        public static IServiceCollection AddSingletonGroup(this IServiceCollection services, WebApplicationBuilder builder)
        {
            //Add the Cache in memory
            builder.Services.AddMemoryCache();

            services.AddSingleton<IAuthorizationHandler, MultipleClaimsHandler>();

            //Add AutoMapper
            services.AddAutoMapper((cfg =>
            {
                cfg.AddProfile(new MappingProfile(builder.Environment));
                cfg.AddProfile(new CashReportProfile(builder.Services.BuildServiceProvider()));
            }));

            return services;
        }
    }
}
