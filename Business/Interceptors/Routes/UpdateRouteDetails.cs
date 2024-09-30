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

namespace Business.Interceptors.Routes
{
    [Order(1)]
    [AllArgsConstructor]
    public partial class UpdateRouteDetails : IEntityAfterUpdateInterceptor<Route, RouteRequest>
    {
        private readonly ILogger<EntityService<Route, RouteRequest, ObjectId>> _logger;
        private readonly IMapper _mapper;
        private readonly IMongoContext _context;
        private readonly IChangeOrderStatus _changeOrderStatus;
        public Response<Route, List<ValidationFailure>> Execute(Response<Route, List<ValidationFailure>> response, RouteRequest request, Route prevState)
        {
            try
            {
                if (request.RouteDetails.Count > 0)
                {
                    List<RouteDetail> entities = _mapper.Map<List<RouteDetailRequest>, List<RouteDetail>>(request.RouteDetails);

                    foreach (var entity in entities)
                    {
                        entity.RouteId = response.Data!.Id;
                        entity.CreatedAt = DateTime.Now.ToUniversalTime();
                        entity.UpdatedAt = null;
                        entity.UpdatedBy = null;
                        entity.CreatedBy = response.Data.UpdatedBy!.Value;
                    }

                    IMongoCollection<RouteDetail> database = _context.Database.GetCollection<RouteDetail>(nameof(RouteDetail).Pluralize());

                    database.InsertMany(entities);

                    List<ChangeOrderStatusRequest> orders = request.RouteDetails.Select(x => new ChangeOrderStatusRequest()
                    {
                        OrderStateId = OrderStatuses.HasRoute,
                        OrderId = ObjectId.Parse(x.OrderId)
                    }).ToList();

                    response.Success = _changeOrderStatus.ExecuteChange(orders);
                    response.Message = "Ruta y detalles de rutas actualizados correctamente";
                }
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "Error al crear detalle de rutas luego de actualizar ruta";

                _logger.LogError(e, "Error al crear detalle de rutas luego de actualizar ruta {route}, Usuario: {user} Error: {error}", response.Data!.Id, response.Data.UpdatedBy, e.Message);
            }

            return response;
        }
    }
}
