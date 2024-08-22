
using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Order : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public ObjectId CustomerId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public DateTime? DeliveryDate { get; set; }
        public ObjectId PaymentTypeId { get; set; }
        public ObjectId OrderStateId { get; set; }
        public decimal Total { get; set; }
        public List<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Catalogue? PaymentType { get; set; }
        public virtual Catalogue? OrderState { get; set; }
    }
}
