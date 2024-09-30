using Business.Interfaces.Interceptors;
using Business.Services;
using Business.Util;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Humanizer;
using Lombok.NET;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Business.Interceptors.Orders
{
    [Order(1)]
    [AllArgsConstructor]
    public partial class ReduceStock : IEntityAfterCreateInterceptor<Order, OrderRequest>
    {
        private readonly IMongoContext _context;
        private readonly ILogger<OrderService> _logger;
        public Response<Order, List<ValidationFailure>> Execute(Response<Order, List<ValidationFailure>> response, OrderRequest request)
        { 
            try
            {
                var products = _context.Database.GetCollection<Product>(nameof(Product).Pluralize());

                foreach (var orderDetail in response.Data!.OrderDetails.Where(x =>
                             !x.ProductName.ToLower().Contains("envio")))
                {
                    FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(x => x.Id, orderDetail.ProductId);
                    UpdateDefinition<Product>
                        update = Builders<Product>.Update.Inc(x => x.Stock, -orderDetail.Quantity);
                    products.FindOneAndUpdate(filter, update);
                }

                response.Message = "create order and stock updated successful";
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = "Error al actualizar stock luego de crear la orden";

                _logger.LogError(e, "Error al actualizar stock luego de crear la orden {order}, Usuario: {user} Error: {error}",response.Data!.Id, response.Data.CreatedBy, e.Message);
            }

            return response;
        }
    }
}
