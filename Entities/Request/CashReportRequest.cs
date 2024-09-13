using Entities.Response;

namespace Entities.Request
{
    public class CashReportRequest
    {
        public string? Id { get; set; } 
        public string? CashierName { get; set; }
        public string? Observations { get; set; }
        public int State { get; set; } = 1;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public List<OrderResponse> Orders { get; set; } = new List<OrderResponse>();
    }
}
