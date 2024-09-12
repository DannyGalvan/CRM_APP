
using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class CashReportDetail : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public ObjectId CashReportId { get; set; }
        public ObjectId OrderId { get; set; }
        public int State { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual CashReport? Route { get; set; }
        public virtual Order? Order { get; set; }
    }
}
