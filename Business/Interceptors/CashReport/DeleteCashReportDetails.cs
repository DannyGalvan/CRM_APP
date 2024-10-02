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
    public partial class DeleteCashReportDetails : IEntityAfterPartialUpdateInterceptor<Entities.Models.CashReport, CashReportRequest>
    {
        private readonly ILogger<EntityService<Entities.Models.CashReport, CashReportRequest, ObjectId>> _logger;
        private readonly IMongoContext _context;
        private readonly IChangeOrderStatus _changeOrderStatus;
        public Response<Entities.Models.CashReport, List<ValidationFailure>> Execute(Response<Entities.Models.CashReport, List<ValidationFailure>> response, CashReportRequest request, Entities.Models.CashReport prevState)
        {
            try
            {
                if (response.Data!.State == 0)
                {
                    IMongoCollection<CashReportDetail> database = _context.Database.GetCollection<CashReportDetail>(nameof(CashReportDetail).Pluralize());

                    var filter = Builders<CashReportDetail>.Filter.Eq(x => x.CashReportId, ObjectId.Parse(request.Id));
                    var update = Builders<CashReportDetail>.Update.Set(x => x.State, 0);
                    var updateUpdatedAt = Builders<CashReportDetail>.Update.Set(x => x.UpdatedAt, DateTime.Now.ToUniversalTime());
                    var updateUpdatedBy = Builders<CashReportDetail>.Update.Set(x => x.UpdatedBy, response.Data.UpdatedBy);

                    database.UpdateMany(filter, update);
                    database.UpdateMany(filter, updateUpdatedAt);
                    database.UpdateMany(filter, updateUpdatedBy);

                    var ordersToDesligate = database.Find(filter).ToList();

                    List<ChangeOrderStatusRequest> orders = ordersToDesligate.Select(x => new ChangeOrderStatusRequest
                    {
                        OrderStateId = OrderStatuses.HasRoute,
                        OrderId = x.OrderId
                    }).ToList();

                    response.Success = _changeOrderStatus.ExecuteChange(orders);
                    response.Message = "Corte de caja y detalles de corte eliminados correctamente";
                }
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "Error al eliminar detalles de corte de caja luego de eliminar corte";

                _logger.LogError(e, "Error al eliminar detalles de corte de caja luego de eliminar corte {route}, Usuario: {user} Error: {error}", response.Data!.Id, response.Data.CreatedBy, e.Message);
            }

            return response;
        }
    }
}
