
using MongoDB.Bson;

namespace Entities.Request
{
    public class ChangeOrderStatusRequest
    {
        public ObjectId OrderId { get; set; }
        public ObjectId OrderStateId { get; set; }
    }
}
