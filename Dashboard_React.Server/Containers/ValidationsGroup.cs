using Business.Validations.Auth;
using Business.Validations.CashReport;
using Business.Validations.CashReportDetail;
using Business.Validations.Catalog;
using Business.Validations.Collection;
using Business.Validations.Customer;
using Business.Validations.CustomerDirection;
using Business.Validations.Event;
using Business.Validations.Order;
using Business.Validations.Pilot;
using Business.Validations.Product;
using Business.Validations.Route;
using Business.Validations.RouteDetail;
using Entidades.Request;
using Entities.Request;
using FluentValidation;
using PartialUpdateCustomerValidator = Business.Validations.Customer.PartialUpdateCustomerValidator;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection
{
    public static class ValidationsGroup
    {
        public static IServiceCollection AddValidationsGroup(this IServiceCollection services)
        {
            //Validations de autenticación
            services.AddScoped<IValidator<LoginRequest>, LoginValidations>();
            //Validations de usuarios
            services.AddScoped<IValidator<ChangePasswordRequest>, ChangePasswordValidations>();
            services.AddScoped<IValidator<ResetPasswordRequest>, ResetPasswordValidations>();
            services.AddScoped<IValidator<RecoveryPasswordRequest>, RecoveryPasswordValidations>();
            //Validations de bulk
            services.AddScoped<IValidator<BulkRouteDetailRequest>, BulkRouteDetailValidator>();
            services.AddScoped<IValidator<BulkUpdateOrderRequest>, BulkUpdateOrderValidator>();
            services.AddScoped<IValidator<BulkCashReportDetailRequest>, BulkCreateCashReportDetailValidator>();
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
            //Validations of Pilots
            services.AddKeyedScoped<IValidator<PilotRequest>, CreatePilotValidator>("Create");
            services.AddKeyedScoped<IValidator<PilotRequest>, UpdatePilotValidator>("Update");
            services.AddKeyedScoped<IValidator<PilotRequest>, PartialUpdatePilotValidator>("PartialUpdate");
            //Validations of Routes
            services.AddKeyedScoped<IValidator<RouteRequest>, CreateRouteValidator>("Create");
            services.AddKeyedScoped<IValidator<RouteRequest>, UpdateRouteValidator>("Update");
            services.AddKeyedScoped<IValidator<RouteRequest>, PartialUpdateRouteValidator>("PartialUpdate");
            //Validations of RouteDetails
            services.AddKeyedScoped<IValidator<RouteDetailRequest>, CreateRouteDetailValidator>("Create");
            services.AddKeyedScoped<IValidator<RouteDetailRequest>, UpdateRouteDetailValidator>("Update");
            services.AddKeyedScoped<IValidator<RouteDetailRequest>, PartialUpdateRouteDetailValidator>("PartialUpdate");
            //Validations of CustomerDirections
            services.AddKeyedScoped<IValidator<CustomerDirectionRequest>, CreateCustomerDirectionValidator>("Create");
            services.AddKeyedScoped<IValidator<CustomerDirectionRequest>, UpdateCustomerDirectionValidator>("Update");
            services.AddKeyedScoped<IValidator<CustomerDirectionRequest>, PartialUpdateCustomerDirectionValidator>("PartialUpdate");
            //Validations of CashReports
            services.AddKeyedScoped<IValidator<CashReportRequest>, CreateCashReportValidator>("Create");
            services.AddKeyedScoped<IValidator<CashReportRequest>, UpdateCashResportValidator>("Update");
            services.AddKeyedScoped<IValidator<CashReportRequest>, PartialUpdateCashReportValidator>("PartialUpdate");
            //Validations of CashReportDetails
            services.AddKeyedScoped<IValidator<CashReportDetailRequest>, CreateCashReportDetailValidator>("Create");
            services.AddKeyedScoped<IValidator<CashReportDetailRequest>, UpdateCashReportDetailValidator>("Update");
            services.AddKeyedScoped<IValidator<CashReportDetailRequest>, PartialUpdateCashReportDetailValidator>("PartialUpdate");

            return services;
        }
    }
}
