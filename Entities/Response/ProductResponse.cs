
using Entities.Models;

namespace Entities.Response
{
    public class ProductResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string FamilyId { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal SalePrice { get; set; }
        public int Stock { get; set; } = 0;
        public int State { get; set; } = 1;
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }

        public virtual CatalogueResponse? Family { get; set; }
    }
}
