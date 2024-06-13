using MongoDB.Bson;

namespace Entities.Request
{
    public class EventRequest
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public bool? AllDay { get; set; }
        public ObjectId? UserId { get; set; } = null;
        public bool? IsActive { get; set; } = true;
        public DateTime? Start { get; set; } = DateTime.Now;
        public DateTime? End { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
