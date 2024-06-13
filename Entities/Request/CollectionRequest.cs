using MongoDB.Bson;

namespace Entities.Request
{
    public class CollectionRequest
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? NameView { get; set; }
        public bool? IsReadOnly { get; set; }
        public bool? IsVisible { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? DeletedBy { get; set; }
    }
}
