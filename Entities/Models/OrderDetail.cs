
using MongoDB.Bson;

namespace Entities.Models
{
    public class OrderDetail
    {
        public int NumberLine { get; set; }
        public ObjectId ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalLine { get; set; }

        public virtual Product? Product { get; set; }
    }
}
