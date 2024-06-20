

using Entities.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Entities.Models
{
    public class Operation : IEntity<ObjectId>
    {

        public ObjectId Id { get; set; }
        public string Name        { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon        { get; set; } = string.Empty;
        public string Path        { get; set; } = string.Empty;
        public ObjectId ModuleId  { get; set; }
        public bool   IsVisible   { get; set; }
        public DateTime CreatedAt   { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }

        public virtual Module? Module { get; set; }
        [BsonIgnore]
        public virtual ICollection<UserOperation> UserOperations { get; } = new List<UserOperation>();
    }
}
