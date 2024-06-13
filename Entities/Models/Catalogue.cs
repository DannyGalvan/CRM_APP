
using Entities.Interfaces;
using MongoDB.Bson;

namespace Entities.Models
{
    public class Catalogue : ICatalogue, IEntity<ObjectId>
    {
        public         ObjectId Id { get; set; }
        public         string  Name        { get; set; } = string.Empty;    
        public         string  Description { get; set; } = string.Empty;
        public         int     State      { get; set; } = 1;
        public         DateTime  CreatedAt   { get; set; } = DateTime.Now;    
        public         DateTime? UpdatedAt   { get; set; }
        public         ObjectId CreatedBy { get; set; }
        public         ObjectId? UpdatedBy { get; set; }
    }
}
