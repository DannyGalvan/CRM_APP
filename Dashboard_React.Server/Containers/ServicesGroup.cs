using Business.Interfaces;
using Business.Services;
using Business.Util;
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
            //inject custom services
            services.AddScoped<ISendMail, SendEmail>();
            services.AddScoped<IRouteVerification, RouteVerificationService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICalendarEventService, CalendarEventService>();
            services.AddScoped<ICatalogueService, CatalogueService>();
            services.AddScoped<IDashboardServices, DashboardServices>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IRouteDetailService, RouteDetailService>();
            services.AddScoped<ICashReportDetailService, CashReportDetailService>();
            //inject EntityService
            services.AddScoped<IEntityService<Customer, CustomerRequest, ObjectId>, EntityService<Customer, CustomerRequest, ObjectId>>();
            services.AddScoped<IEntityService<Product, ProductRequest, ObjectId>, EntityService<Product, ProductRequest, ObjectId>>();
            services.AddScoped<IEntityService<Collection, CollectionRequest, ObjectId>, EntityService<Collection, CollectionRequest, ObjectId>>();
            services.AddScoped<IEntityService<Operation, OperationRequest, ObjectId>, EntityService<Operation, OperationRequest, ObjectId>>();
            services.AddScoped<IEntityService<Pilot, PilotRequest, ObjectId>, EntityService<Pilot, PilotRequest, ObjectId>>();
            services.AddScoped<IEntityService<Route, RouteRequest, ObjectId>, EntityService<Route, RouteRequest, ObjectId>>();
            services.AddScoped<IEntityService<CustomerDirection, CustomerDirectionRequest, ObjectId>, EntityService<CustomerDirection, CustomerDirectionRequest, ObjectId>>();
            services.AddScoped<IEntityService<CashReport, CashReportRequest, ObjectId>, EntityService<CashReport, CashReportRequest, ObjectId>>();
            

            return services;
        }
    }
}
