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
    public partial class UpdateCashReportDetails : IEntityAfterUpdateInterceptor<Entities.Models.CashReport, CashReportRequest>
    {
        private readonly ILogger<EntityService<Entities.Models.CashReport, CashReportRequest, ObjectId>> _logger;
        private readonly IMapper _mapper;
        private readonly IMongoContext _context;
        private readonly IChangeOrderStatus _changeOrderStatus;

        public Response<Entities.Models.CashReport, List<ValidationFailure>> Execute(Response<Entities.Models.CashReport, List<ValidationFailure>> response, CashReportRequest request, Entities.Models.CashReport prevState)
        {
            try
            {
                if (request.Orders.Count > 0)
                {
                    List<CashReportDetail> entities = _mapper.Map<List<OrderResponse>, List<CashReportDetail>>(request.Orders);

                    IMongoCollection<CashReportDetail> database = _context.Database.GetCollection<CashReportDetail>(nameof(CashReportDetail).Pluralize());

                    foreach (var detail in from detail in entities let filter = Builders<CashReportDetail>.Filter.Eq(x => x.OrderId, detail.OrderId) let existEntity = database.Find(filter).ToList().FirstOrDefault(x => x.State == 1) where existEntity == null select detail)
                    {
                        detail.CashReportId = response.Data!.Id;
                        detail.CreatedAt = DateTime.Now.ToUniversalTime();
                        detail.UpdatedAt = null;
                        detail.UpdatedBy = null;
                        detail.CreatedBy = response.Data.CreatedBy;

                        database.InsertOne(detail);
                    }

                    List<ChangeOrderStatusRequest> orders = request.Orders.Select(x => new ChangeOrderStatusRequest()
                    {
                        OrderStateId = OrderStatuses.Delivered,
                        OrderId = ObjectId.Parse(x.Id)
                    }).ToList();

                    response.Success = _changeOrderStatus.ExecuteChange(orders);
                    response.Message = "Corte de caja y detalles de corte actualizados correctamente";
                }
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "Error al actualizar detalles de corte de caja luego de crear corte";

                _logger.LogError(e, "Error al actualizar detalles de corte de caja luego de crear corte {route}, Usuario: {user} Error: {error}", response.Data!.Id, response.Data.CreatedBy, e.Message);
            }

            return response;
        }
    }
}
