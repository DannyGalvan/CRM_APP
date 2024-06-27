using Business.Validations.Auth;
using Business.Validations.Catalog;
using Business.Validations.Collection;
using Business.Validations.Customer;
using Business.Validations.Event;
using Business.Validations.Order;
using Business.Validations.Product;
using Entidades.Request;
using Entities.Request;
using FluentValidation;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection
{
    public static class ValidationsGroup
    {
        public static IServiceCollection AddValidationsGroup(this IServiceCollection services)
        {
            services.AddScoped<IValidator<LoginRequest>, LoginValidations>();
            services.AddScoped<IValidator<ChangePasswordRequest>, ChangePasswordValidations>();
            services.AddScoped<IValidator<ResetPasswordRequest>, ResetPasswordValidations>();
            services.AddScoped<IValidator<RecoveryPasswordRequest>, RecoveryPasswordValidations>();
            //Validations de catálogo
            services.AddKeyedScoped<IValidator<CatalogueRequest>,CreateCatalogValidator>("Create");
            services.AddKeyedScoped<IValidator<CatalogueRequest>, UpdateCatalogValidator >("Update");
            services.AddKeyedScoped<IValidator<CatalogueRequest>,PartialUpdateCatalogValidator>("PartialUpdate");
            //Validations of collections
            services.AddKeyedScoped<IValidator<CollectionRequest>,CreateCollectionValidator>("Create");
            services.AddKeyedScoped<IValidator<CollectionRequest>,UpdateCollectionValidator>("Update");
            services.AddKeyedScoped<IValidator<CollectionRequest>,PartialUpdateCollectionValidator>("PartialUpdate");
            //Validations of customers
            services.AddKeyedScoped<IValidator<CustomerRequest>, CreateCustomerValidator>("Create");
            services.AddKeyedScoped<IValidator<CustomerRequest>, UpdateCustomerValidator>("Update");
            services.AddKeyedScoped<IValidator<CustomerRequest>, PartialUpdateCustomerValidator>("PartialUpdate");
            //Validations of products
            services.AddKeyedScoped<IValidator<ProductRequest>, CreateProductValidator>("Create");
            services.AddKeyedScoped<IValidator<ProductRequest>, UpdateProductValidator>("Update");
            services.AddKeyedScoped<IValidator<ProductRequest>, PartialUpdateProductValidator>("PartialUpdate");
            //Validations of events
            services.AddKeyedScoped<IValidator<EventRequest>, CreateEventValidator>("Create");
            services.AddKeyedScoped<IValidator<EventRequest>, UpdateEventValidator>("Update");
            services.AddKeyedScoped<IValidator<EventRequest>, PartialUpdateEventValidator>("PartialUpdate");
            //Validations of Orders
            services.AddKeyedScoped<IValidator<OrderRequest>, CreateOrderValidator>("Create");
            services.AddKeyedScoped<IValidator<OrderRequest>, UpdateOrderValidator>("Update");
            services.AddKeyedScoped<IValidator<OrderRequest>, PartialupdateOrderValidator>("PartialUpdate");

            return services;
        }
    }
}
