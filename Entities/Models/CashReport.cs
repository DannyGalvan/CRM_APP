using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class CashReport : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public string CashierName { get; set; } = string.Empty;
        public string Observations { get; set; } = string.Empty;
        public Dictionary<string, decimal> TotalByPaymentTypes { get; set; } = new Dictionary<string, decimal>();
        public int OrdersQuantity { get; set; }
        public decimal Total { get; set; }
        public int State { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }
    }
}
