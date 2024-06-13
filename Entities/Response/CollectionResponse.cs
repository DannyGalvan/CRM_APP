namespace Entities.Response
{
    public class CollectionResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string NameView { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public bool IsReadOnly { get; set; }
        public bool IsVisible { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }
        public string? DeletedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
        public string DeletedBy { get; set; } = string.Empty;
    }
}
