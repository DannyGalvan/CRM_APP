using AutoMapper;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using MongoDB.Bson;

namespace Business.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile(IWebHostEnvironment env)
        {
            // mapper de eventos
            CreateMap<EventRequest, Event>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => env.IsProduction() ? src.Start!.Value : src.Start!.Value.ToUniversalTime()))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => env.IsProduction() ? src.End!.Value : src.End!.Value.ToUniversalTime()))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());

            CreateMap<Event, EventResponse>()
                .ForMember(dest => dest.Start, opt => opt.MapFrom(src => src.StartDate.AddHours(-6).ToString("yyyy-MM-dd HH:mm:ss")))
                .ForMember(dest => dest.End, opt => opt.MapFrom(src => src.EndDate.AddHours(-6).ToString("yyyy-MM-dd HH:mm:ss")))
                .ForMember(dest => dest.AllDay, opt => opt.MapFrom(src => src.AllDay!.Value))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty));

            // mapper de clientes
            CreateMap<CustomerRequest, Customer>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.DepartmentId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.DepartmentId) ? ObjectId.Parse(src.DepartmentId) : ObjectId.Empty))
                .ForMember(dest => dest.MunicipalityId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.MunicipalityId) ? ObjectId.Parse(src.MunicipalityId) : ObjectId.Empty))
                .ForMember(dest => dest.ZoneId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.ZoneId) ? ObjectId.Parse(src.ZoneId) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Department, opt => opt.Ignore())
                .ForMember(dest => dest.Municipality, opt => opt.Ignore())
                .ForMember(dest => dest.Zone, opt => opt.Ignore())
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.SecondName} {src.FirstLastName} {src.SecondLastName}"));

            CreateMap<Customer, CustomerResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.DepartmentId, opt => opt.MapFrom(src => src.DepartmentId.ToString()))
                .ForMember(dest => dest.MunicipalityId, opt => opt.MapFrom(src => src.MunicipalityId.ToString()))
                .ForMember(dest => dest.ZoneId, opt => opt.MapFrom(src => src.ZoneId.ToString()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department))
                .ForMember(dest => dest.Municipality, opt => opt.MapFrom(src => src.Municipality))
                .ForMember(dest => dest.Zone, opt => opt.MapFrom(src => src.Zone))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));

            // mapper de productos
            CreateMap<ProductRequest, Product>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.FamilyId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.FamilyId) ? ObjectId.Parse(src.FamilyId) : ObjectId.Empty))
                .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => src.SalePrice ?? 0M))
                .ForMember(dest => dest.Cost, opt => opt.MapFrom(src => src.Cost ?? 0M))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.State, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Family, opt => opt.Ignore())
                .ForMember(dest => dest.OrderDetails, opt => opt.Ignore());

            CreateMap<Product, ProductResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.FamilyId, opt => opt.MapFrom(src => src.FamilyId.ToString()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.Family, opt => opt.MapFrom(src => src.Family))
                .ForMember(dest => dest.Cost, opt => opt.MapFrom(src => src.Cost))
                .ForMember(dest => dest.SalePrice, opt => opt.MapFrom(src => src.SalePrice))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty));

            // mapper de catalogos
            CreateMap<CatalogueRequest, Catalogue>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<Catalogue, CatalogueResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty));

            // mapper de operaciones
            CreateMap<Operation, OperationResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.ModuleId, opt => opt.MapFrom(src => src.ModuleId.ToString()));

            // mapper de modulos
            CreateMap<Module, ModuleResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()));

            // mapper de collections
            CreateMap<CollectionRequest, Collection>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedAt, opt => opt.Ignore());

            CreateMap<Collection, CollectionResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty));

            // mapper de ordenes
            CreateMap<OrderRequest, Order>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CustomerId) ? ObjectId.Parse(src.CustomerId) : ObjectId.Empty))
                .ForMember(dest => dest.PaymentTypeId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.PaymentTypeId) ? ObjectId.Parse(src.PaymentTypeId) : ObjectId.Empty))
                .ForMember(dest => dest.OrderStateId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.OrderStateId) ? ObjectId.Parse(src.OrderStateId) : ObjectId.Empty))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.OrderDetails!.Sum(o => o.UnitPrice * o.Quantity) ?? 0M))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.OrderDate, opt => opt.Ignore())
                .ForMember(dest => dest.Customer, opt => opt.Ignore())
                .ForMember(dest => dest.PaymentType, opt => opt.Ignore())
                .ForMember(dest => dest.OrderState, opt => opt.Ignore());

            CreateMap<Order, OrderResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId.ToString()))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.OrderDate.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.PaymentTypeId, opt => opt.MapFrom(src => src.PaymentTypeId.ToString()))
                .ForMember(dest => dest.OrderStateId, opt => opt.MapFrom(src => src.OrderStateId.ToString()))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Total))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty))
                .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.Customer))
                .ForMember(dest => dest.PaymentType, opt => opt.MapFrom(src => src.PaymentType))
                .ForMember(dest => dest.OrderState, opt => opt.MapFrom(src => src.OrderState));

            // mapper de detalles de orden
            CreateMap<OrderDetailRequest, OrderDetail>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.ProductId) ? ObjectId.Parse(src.ProductId) : ObjectId.Empty))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity ?? 0))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice ?? 0M))
                .ForMember(dest => dest.TotalLine, opt => opt.MapFrom(src => src.Quantity * src.UnitPrice))
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            CreateMap<OrderDetail, OrderDetailResponse>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId.ToString()))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product))
                .ForMember(dest => dest.TotalLine, opt => opt.MapFrom(src => src.TotalLine));
        }
    }
}
