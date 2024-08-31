using Business.Interfaces;
using Business.Services;
using Dashboard_React.Server.Filters;
using Entities.Models;
using Entities.Request;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;
using Route = Entities.Models.Route;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServicesGroup
    {
        public static IServiceCollection AddServicesGroup(this IServiceCollection services)
        {
            services.AddScoped<ISendMail, SendEmail>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICalendarEventService, CalendarEventService>();
            services.AddScoped<IRouteDetailService, RouteDetailService>();
            services.AddScoped<IEntityService<Customer, CustomerRequest, ObjectId>, EntityService<Customer, CustomerRequest, ObjectId>>();
            services.AddScoped<IEntityService<Product, ProductRequest, ObjectId>, EntityService<Product, ProductRequest, ObjectId>>();
            services.AddScoped<IEntityService<Collection, CollectionRequest, ObjectId>, EntityService<Collection, CollectionRequest, ObjectId>>();
            services.AddScoped<IEntityService<Order, OrderRequest, ObjectId>, EntityService<Order, OrderRequest, ObjectId>>();
            services.AddScoped<IEntityService<Operation, OperationRequest, ObjectId>, EntityService<Operation, OperationRequest, ObjectId>>();
            services.AddScoped<IEntityService<Pilot, PilotRequest, ObjectId>, EntityService<Pilot, PilotRequest, ObjectId>>();
            services.AddScoped<IEntityService<Route, RouteRequest, ObjectId>, EntityService<Route, RouteRequest, ObjectId>>();
            services.AddScoped<ICatalogueService, CatalogueService>();
            services.AddScoped<IDashboardServices, DashboardServices>();
            services.AddSingleton<IAuthorizationHandler, MultipleClaimsHandler>();

            return services;
        }
    }
}
