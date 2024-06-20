using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Customer : IEntity<ObjectId>
    {
        public ObjectId Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string SecondName { get; set; } = string.Empty;
        public string FirstLastName { get; set; } = string.Empty;
        public string SecondLastName { get; set; } = string.Empty;
        public string FirstPhone { get; set; } = string.Empty;
        public string SecondPhone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public ObjectId DepartmentId { get; set; }
        public ObjectId MunicipalityId { get; set; }
        public ObjectId ZoneId { get; set; }
        public string Colony_Condominium { get; set; } = string.Empty;
        public string SocialNetworks { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public ObjectId CreatedBy { get; set; }
        public ObjectId? UpdatedBy { get; set; }


        public virtual Catalogue? Department { get; set; }
        public virtual Catalogue? Municipality { get; set; }
        public virtual Catalogue? Zone { get; set; }
    }
}
