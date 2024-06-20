using Entities.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities.Models
{
    public class UserOperation : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public ObjectId UserId { get; set; }
        public ObjectId OperationId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public bool Active { get; set; } = true;
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual User? User { get; set; }
        public virtual Operation? Operation { get; set; }

    }
}
