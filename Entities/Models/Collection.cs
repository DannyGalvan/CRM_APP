using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Collection : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string NameView { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public bool IsReadOnly { get; set; }
        public bool IsVisible { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }
        public ObjectId? DeletedBy { get; set; }
    }
}
