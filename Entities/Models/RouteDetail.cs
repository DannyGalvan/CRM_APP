using Entities.Interfaces;
using Entities.Response;
using MongoDB.Bson;

namespace Entities.Models
{
    public class RouteDetail : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }    
        public ObjectId RouteId { get; set; }
        public ObjectId OrderId { get; set; }
        public int State { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual Route? Route { get; set; }
        public virtual Order? Order { get; set; }
    }
}
