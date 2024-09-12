using AutoMapper;
using Business.Mappers;
using Dashboard_React.Server.Filters;
using Entities.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace Dashboard_React.Server.Containers
{
    public static class SingletonServices
    {
        public static IServiceCollection AddSingletonGroup(this IServiceCollection services, WebApplicationBuilder builder)
        {
            //Add the HttpContextAccessor
            builder.Services.AddHttpContextAccessor();

            //Add the Cache in memory
            builder.Services.AddMemoryCache();

            services.AddSingleton<IAuthorizationHandler, MultipleClaimsHandler>();

            //Add AutoMapper
            services.AddSingleton(provider => new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfile(builder.Environment));

                var context = provider.GetService<IMongoContext>();

                if (context != null)
                {
                    cfg.AddProfile(new CashReportProfile(context));
                }
            }).CreateMapper());

            return services;
        }
    }
}
