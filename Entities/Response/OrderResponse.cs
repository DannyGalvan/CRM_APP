
namespace Entities.Response
{
    public class OrderResponse
    {
        public string Id { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string OrderDate { get; set; } = string.Empty;
        public string DeliveryDate { get; set; } = string.Empty;
        public string PaymentTypeId { get; set; } = string.Empty;
        public string OrderStateId { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public List<OrderDetailResponse> OrderDetails { get; set; } = new List<OrderDetailResponse>();
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }

        public virtual CustomerResponse? Customer { get; set; }
        public virtual CatalogueResponse? PaymentType { get; set; }
        public virtual CatalogueResponse? OrderState { get; set; }
    }
}
