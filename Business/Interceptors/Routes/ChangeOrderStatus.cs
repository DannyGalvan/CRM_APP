using Business.Interfaces.Interceptors;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Humanizer;
using Lombok.NET;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Business.Interceptors.Routes
{
    [AllArgsConstructor]
    public partial class ChangeOrderStatus : IChangeOrderStatus
    {
        private readonly IMongoContext _context;
        private readonly ILogger<IChangeOrderStatus> _logger;
        public bool ExecuteChange(List<ChangeOrderStatusRequest> orders)
        {
            bool result = true;

            try
            {
                IMongoCollection<Order> database = _context.Database.GetCollection<Order>(nameof(Order).Pluralize());

                foreach (var order in orders)
                {
                    var filter = Builders<Order>.Filter.Eq(x => x.Id, order.OrderId);
                    var update = Builders<Order>.Update.Set(x => x.OrderStateId, order.OrderStateId);

                    database.UpdateOne(filter, update);
                }

                return result;

            }
            catch (Exception e)
            {
               result = false;
                _logger.LogError(e, "Error al cambiar el estado de las ordenes {orders}, Error: {error}", string.Join(',', orders.Select(x => x.OrderId)), e.Message);
            }

            return result;
        }
    }
}
