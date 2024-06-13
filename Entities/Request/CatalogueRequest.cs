
namespace Entities.Request
{
    public class CatalogueRequest
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int State { get; set; } = 1;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
