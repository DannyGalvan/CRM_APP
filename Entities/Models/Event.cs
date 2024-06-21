using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Event : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool? AllDay { get; set; } = false;
        public ObjectId UserId { get; set; }
        public bool? IsActive { get; set; } = true;
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime EndDate { get; set; } = DateTime.Now;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual User? User { get; set; }        
    }
}