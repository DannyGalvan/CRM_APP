﻿using Entities.Context;
using Entities.Interfaces;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection
{
    public static class ContextGroup
    {
        public static IServiceCollection AddContextGroup(this IServiceCollection services)
        {
            services.AddScoped<ICRMContext, CRMContext>();
            services.AddScoped<IMongoContext, MongoContext>();

            return services;
        }
    }
}
