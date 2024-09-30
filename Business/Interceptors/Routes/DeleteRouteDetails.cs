
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

namespace Business.Interceptors.Routes
{
    [Order(1)]
    [AllArgsConstructor]
    public partial class DeleteRouteDetails : IEntityAfterPartialUpdateInterceptor<Route,RouteRequest>
    {
        private readonly ILogger<EntityService<Route, RouteRequest, ObjectId>> _logger;
        private readonly IMongoContext _context;
        private readonly IChangeOrderStatus _changeOrderStatus;
        public Response<Route, List<ValidationFailure>> Execute(Response<Route, List<ValidationFailure>> response, RouteRequest request, Route prevState)
        {
            try
            {
                if (response.Data!.State == 0)
                {
                    IMongoCollection<RouteDetail> database = _context.Database.GetCollection<RouteDetail>(nameof(RouteDetail).Pluralize());

                    var filter = Builders<RouteDetail>.Filter.Eq(x => x.RouteId, ObjectId.Parse(request.Id));
                    var update = Builders<RouteDetail>.Update.Set(x => x.State, 0);
                    var updateUpdatedAt = Builders<RouteDetail>.Update.Set(x => x.UpdatedAt, DateTime.Now.ToUniversalTime());
                    var updateUpdatedBy = Builders<RouteDetail>.Update.Set(x => x.UpdatedBy, response.Data.UpdatedBy);

                    database.UpdateMany(filter,update);
                    database.UpdateMany(filter, updateUpdatedAt);
                    database.UpdateMany(filter, updateUpdatedBy);

                    var ordersToDesligate = database.Find(filter).ToList();

                    List<ChangeOrderStatusRequest> orders = ordersToDesligate.Select(x => new ChangeOrderStatusRequest
                    {
                        OrderStateId = OrderStatuses.Created,
                        OrderId = x.OrderId
                    }).ToList();

                    response.Success = _changeOrderStatus.ExecuteChange(orders);
                    response.Message = "Ruta y detalles de rutas eliminados correctamente";
                }
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "Error al eliminar detalle de rutas luego de eliminar ruta";

                _logger.LogError(e, "Error al eliminar detalle de rutas luego de eliminar ruta {route}, Usuario: {user} Error: {error}", response.Data!.Id, response.Data.UpdatedBy, e.Message);
            }

            return response;
        }
    }
}
