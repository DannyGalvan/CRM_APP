using MongoDB.Bson.Serialization.Attributes;

namespace Entities.Models
{
    public class Module : Catalogue
    {
        public string Image { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        [BsonIgnore]
        public virtual ICollection<Operation> Operations { get; } = new List<Operation>(); 
    }
}
