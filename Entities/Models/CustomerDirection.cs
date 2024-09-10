using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class CustomerDirection : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public ObjectId CustomerId { get; set; }
        public ObjectId DepartmentId { get; set; }
        public ObjectId MunicipalityId { get; set; }
        public ObjectId ZoneId { get; set; }
        public string? ColonyCondominium { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int State { get; set; } = 1;
        public DateTime CreatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Catalogue? Department { get; set; }
        public virtual Catalogue? Municipality { get; set; }
        public virtual Catalogue? Zone { get; set; }
    }
}
