using Business.Interfaces;
using Business.Repository;
using Business.Services;
using Entities.Models;
using Entities.Request;
using MongoDB.Bson;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class ServicesGroup
    {

        public static IServiceCollection AddServicesGroup(this IServiceCollection services)
        {
            services.AddScoped<ISendMail, SendEmail>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICalendarEventService, CalendarEventService>();
            services.AddScoped<IEntityService<Customer, CustomerRequest, ObjectId>, EntityService<Customer, CustomerRequest, ObjectId>>();
            services.AddScoped<IEntityService<Product, ProductRequest, ObjectId>, EntityService<Product, ProductRequest, ObjectId>>();
            services.AddScoped<IEntityService<Collection, CollectionRequest, ObjectId>, EntityService<Collection, CollectionRequest, ObjectId>>();
            services.AddScoped<IEntityService<Order, OrderRequest, ObjectId>, EntityService<Order, OrderRequest, ObjectId>>();
            services.AddScoped<IEntityService<Operation, OperationRequest, ObjectId>, EntityService<Operation, OperationRequest, ObjectId>>();
            services.AddScoped<ICatalogueService, CatalogueService>();

            return services;
        }
    }
}
