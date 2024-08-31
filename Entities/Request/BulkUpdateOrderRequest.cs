
namespace Entities.Request
{
    public class BulkUpdateOrderRequest
    {
        public List<OrderRequest> Orders { get; set; } = new List<OrderRequest>();
        public string? UpdatedBy { get; set; }
    }
}
