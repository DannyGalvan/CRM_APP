
using Entities.Models;

namespace Entities.Response
{
    public class OrderDetailResponse
    {
        public int NumberLine { get; set; }
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalLine { get; set; }

        public virtual Product? Product { get; set; }
    }
}
