using AutoMapper;
using Business.Interfaces.Interceptors;
using Business.Services;
using Business.Util;
using Entities.Enums;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Humanizer;
using Lombok.NET;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Interceptors.CashReport
{
    [Order(1)]
    [AllArgsConstructor]
    public partial class CreateCashReportDetails : IEntityAfterCreateInterceptor<Entities.Models.CashReport, CashReportRequest>
    {
        private readonly ILogger<EntityService<Entities.Models.CashReport, CashReportRequest, ObjectId>> _logger;
        private readonly IMapper _mapper;
        private readonly IMongoContext _context;
        private readonly IChangeOrderStatus _changeOrderStatus;

        public Response<Entities.Models.CashReport, List<ValidationFailure>> Execute(Response<Entities.Models.CashReport, List<ValidationFailure>> response, CashReportRequest request)
        {
            try
            {
                List<CashReportDetail> entities = _mapper.Map<List<OrderResponse>, List<CashReportDetail>>(request.Orders);

                foreach (var entity in entities)
                {
                    entity.CashReportId = response.Data!.Id;
                    entity.CreatedAt = DateTime.Now.ToUniversalTime();
                    entity.UpdatedAt = null;
                    entity.UpdatedBy = null;
                    entity.CreatedBy = response.Data.CreatedBy;
                }

                IMongoCollection<CashReportDetail> database = _context.Database.GetCollection<CashReportDetail>(nameof(CashReportDetail).Pluralize());

                database.InsertMany(entities);

                List<ChangeOrderStatusRequest> orders = request.Orders.Select(x => new ChangeOrderStatusRequest()
                {
                    OrderStateId = OrderStatuses.Delivered,
                    OrderId = ObjectId.Parse(x.Id)
                }).ToList();

                response.Success = _changeOrderStatus.ExecuteChange(orders);
                response.Message = "Corte de caja y detalles de corte creados correctamente";
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "Error al crear detalles de corte de caja luego de crear corte";

                _logger.LogError(e, "Error al crear detalles de corte de caja luego de crear corte {route}, Usuario: {user} Error: {error}", response.Data!.Id, response.Data.CreatedBy, e.Message);
            }

            return response;
        }
    }
}
