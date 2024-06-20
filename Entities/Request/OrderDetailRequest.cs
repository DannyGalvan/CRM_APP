
namespace Entities.Request
{
    public class OrderDetailRequest
    {
        public int? NumberLine { get; set; }
        public string? ProductId { get; set; }
        public string? ProductName { get; set; }
        public int? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
    }
}
