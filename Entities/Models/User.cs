using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class User : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public bool? Active { get; set; } = true;
        public bool? Confirm { get; set; } = false;
        public bool? Reset { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = DateTime.Now;
        public string DateToken { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string? RecoveryToken { get; set; }
        public string ConnectionString { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }


        public virtual ICollection<UserOperation> UserOperations { get; set; } = new List<UserOperation>();
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
