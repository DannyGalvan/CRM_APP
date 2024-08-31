using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Route : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public ObjectId PilotId { get; set; }
        public string Observations { get; set; } = string.Empty;
        public int State { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }


        public virtual Pilot? Pilot { get; set; }
    }
}
