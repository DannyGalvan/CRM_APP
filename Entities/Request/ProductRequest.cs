
namespace Entities.Request
{
    public class ProductRequest
    {
        public string? Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? FamilyId { get; set; } = string.Empty;        
        public decimal? Cost { get; set; }
        public decimal? SalePrice { get; set; }
        public int? Stock { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
