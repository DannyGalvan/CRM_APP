using AutoMapper;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Mappers
{
    public class CashReportProfile : Profile
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly Dictionary<string, object> _context = new();
        public CashReportProfile(IServiceProvider serviceProvider)
        {
            // Dependency injection
            _serviceProvider = serviceProvider;

            // CashReport mapper
            CreateMap<CashReportRequest, CashReport>()
                .ForMember(dest => dest.Id,
                    opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.Observations, opt => opt.MapFrom(src => src.Observations))
                .ForMember(dest => dest.CashierName, opt => opt.MapFrom(src => src.CashierName))
                .ForMember(dest => dest.CreatedBy,
                    opt => opt.MapFrom(src =>
                        !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy,
                    opt => opt.MapFrom(src =>
                        !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                .ForMember(dest => dest.OrdersQuantity, opt => opt.MapFrom((src, _, _, _) => {
                    var cashReportConvert = ConvertCashReport(src.Orders);

                    _context.Clear();

                    _context.TryAdd("Report", cashReportConvert);

                    return cashReportConvert.OrdersQuantity;
                }))
                .ForMember(dest => dest.Total, opt => opt.MapFrom((_, _, _, _) =>
                {
                    CashReportConvert cashReportConvert = (CashReportConvert) _context.FirstOrDefault(x => x.Key == "Report").Value;
                        return cashReportConvert.Total;
                    }))
                .ForMember(dest => dest.TotalByPaymentTypes, opt => opt.MapFrom((_, _, _, _) =>
                    {  
                        CashReportConvert cashReportConvert = (CashReportConvert)_context.FirstOrDefault(x => x.Key == "Report").Value;

                        return cashReportConvert.TotalByPaymentTypes;
                    }))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<CashReport, CashReportResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.CashierName, opt => opt.MapFrom(src => src.CashierName))
                .ForMember(dest => dest.OrdersQuantity, opt => opt.MapFrom(src => src.OrdersQuantity))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Total))
                .ForMember(dest => dest.TotalByPaymentTypes, opt => opt.MapFrom(src => src.TotalByPaymentTypes))
                .ForMember(dest => dest.Observations, opt => opt.MapFrom(src => src.Observations))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty));

            CreateMap<CashReport, CashReport>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Observations, opt => opt.MapFrom(src => src.Observations))
                .ForMember(dest => dest.CashierName, opt => opt.MapFrom(src => src.CashierName))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.UpdatedBy))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                .ForMember(dest => dest.OrdersQuantity, opt => opt.MapFrom(src => src.OrdersQuantity))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Total))
                .ForMember(dest => dest.TotalByPaymentTypes, opt => opt.MapFrom(src => src.TotalByPaymentTypes))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));

            // CashReportDetail mapper
            CreateMap<CashReportDetailRequest, CashReportDetail>()
                .ForMember(dest => dest.OrderId,
                    opt => opt.MapFrom(src =>
                        !string.IsNullOrEmpty(src.OrderId) ? ObjectId.Parse(src.OrderId) : ObjectId.Empty))
                .ForMember(dest => dest.Id,
                    opt => opt.MapFrom(src =>
                        !string.IsNullOrEmpty(src.Id) ? ObjectId.Parse(src.Id) : ObjectId.Empty))
                .ForMember(dest => dest.CashReportId,
                    opt => opt.MapFrom(src =>
                        !string.IsNullOrEmpty(src.CashReportId) ? ObjectId.Parse(src.CashReportId) : ObjectId.Empty))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.CreatedBy) ? ObjectId.Parse(src.CreatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.UpdatedBy) ? ObjectId.Parse(src.UpdatedBy) : ObjectId.Empty))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Order, opt => opt.Ignore())
                .ForMember(dest => dest.CashReport, opt => opt.Ignore());

            CreateMap<CashReportDetail, CashReportDetailResponse>()
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId.ToString()))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.CashReportId, opt => opt.MapFrom(src => src.CashReportId.ToString()))
                .ForMember(dest => dest.Order, opt => opt.MapFrom(src => src.Order))
                .ForMember(dest => dest.CashReport, opt => opt.MapFrom(src => src.CashReport))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State));

            CreateMap<CashReportDetail, CashReportDetail>()
                .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CashReportId, opt => opt.MapFrom(src => src.CashReportId))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.UpdatedBy))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));

        }

        private IMongoContext GetContextOfProvider()
        {
           return  _serviceProvider.GetRequiredService<IMongoContext>();
        }

        private CashReportConvert ConvertCashReport(List<OrderResponse> src)
        {
            IMongoContext mongo = GetContextOfProvider();

            IMongoCollection<Catalogue> collection = mongo.Database.GetCollection<Catalogue>("PaymentTypes");

            var listPaymentTypes = collection.Find(x => true).ToList();

            var totalByPaymentTypes = new Dictionary<string, decimal>();

            foreach (var payment in listPaymentTypes)
            {
                var orderByPayment = src.Where(x => x.PaymentTypeId == payment.Id.ToString()).ToList();

                if (orderByPayment.Any()) {
                    totalByPaymentTypes.Add(payment.Name, orderByPayment.Sum(x => x.Total));
                }
            }

            return new CashReportConvert
            {
                OrdersQuantity = src.Count,
                Total = src.Sum(x => x.Total),
                TotalByPaymentTypes = totalByPaymentTypes
            };
        }
    }
}
