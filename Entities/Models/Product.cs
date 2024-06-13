using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Product : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ObjectId FamilyId { get; set; }
        public decimal Cost { get; set; }
        public decimal SalePrice { get; set; }
        public int Stock { get; set; } = 0;
        public int State { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual Catalogue? Family { get; set; }
    }
}
