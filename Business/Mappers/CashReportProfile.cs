
using AutoMapper;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using MongoDB.Bson;

namespace Business.Mappers
{
    public class CashReportProfile : Profile
    {
        private readonly IMongoContext _mongo;
        public CashReportProfile(IMongoContext mongo)
        {
            _mongo = mongo;

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
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<Route, RouteResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.PilotId, opt => opt.MapFrom(src => src.PilotId.ToString()))
                .ForMember(dest => dest.Observations, opt => opt.MapFrom(src => src.Observations))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.AddHours(-6).ToString("dd/MM/yyyy HH:mm:ss") : null))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy.ToString()))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => (src.UpdatedBy != null && src.UpdatedBy != ObjectId.Empty) ? src.UpdatedBy.ToString() : string.Empty))
                .ForMember(dest => dest.Pilot, opt => opt.MapFrom(src => src.Pilot));
        }

        private CashReportConvert ConvertCashReport(List<OrderRequest> src)
        {
            return new CashReportConvert
            {
                OrdersQuantity = 0,
                Total = 0,
                TotalByPaymentTypes = new Dictionary<string, decimal>()
            };
        }
    }
}
