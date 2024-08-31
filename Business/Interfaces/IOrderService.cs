using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface IOrderService : IEntityService<Order, OrderRequest, ObjectId>
    {
        public Response<List<Order>, List<ValidationFailure>> BulkUpdate(BulkUpdateOrderRequest request); 
    }
}
