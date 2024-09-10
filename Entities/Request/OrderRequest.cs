
namespace Entities.Request
{
    public class OrderRequest
    {
        public string? Id { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? CustomerId { get; set; }
        public string? CustomerDirectionId { get; set; }
        public string? PaymentTypeId { get; set; }
        public string? OrderStateId { get; set; }
        public List<OrderDetailRequest>? OrderDetails { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
