namespace Entities.Response
{
    public class CashReportDetailResponse
    {
        public string Id { get; set; } = string.Empty;
        public string CashReportId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public int State { get; set; } = 1;
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }

        public virtual CashReportResponse? CashReport { get; set; }
        public virtual OrderResponse? Order { get; set; }
    }
}
