using Business.Interfaces.Interceptors;
using Business.Util;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Humanizer;
using Lombok.NET;
using MongoDB.Driver;

namespace Business.Interceptors.Orders
{
    [Order(1)]
    [AllArgsConstructor]
    public partial class ReturnAndReduceStock : IEntityAfterUpdateInterceptor<Order, OrderRequest>
    {
        private readonly IMongoContext _context;

        public Response<Order, List<ValidationFailure>> Execute(Response<Order, List<ValidationFailure>> response,
            OrderRequest request, Order prevState)
        {

            ReturnStock(prevState.OrderDetails);

            ReduceStock(response.Data!.OrderDetails);

            response.Message = "Order create and stock updated successful";

            return response;
        }

        private void ReduceStock(List<OrderDetail> details)
        {
            var products = _context.Database.GetCollection<Product>(nameof(Product).Pluralize());

            foreach (var orderDetail in details.Where(x => !x.ProductName.ToLower().Contains("envio")))
            {
                FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(x => x.Id, orderDetail.ProductId);
                UpdateDefinition<Product> update = Builders<Product>.Update.Inc(x => x.Stock, -orderDetail.Quantity);
                products.FindOneAndUpdate(filter, update);
            }

        }

        private void ReturnStock(List<OrderDetail> details)
        {
            var products = _context.Database.GetCollection<Product>(nameof(Product).Pluralize());

            foreach (var orderDetail in details.Where(x => !x.ProductName.ToLower().Contains("envio")))
            {
                FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(x => x.Id, orderDetail.ProductId);
                UpdateDefinition<Product> update = Builders<Product>.Update.Inc(x => x.Stock, orderDetail.Quantity);
                products.FindOneAndUpdate(filter, update);
            }
        }
    }
}
