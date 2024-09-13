namespace Entities.Request
{
    public class BulkCashReportDetailRequest
    {
        public List<CashReportDetailRequest> CashReportDetails { get; set; } = new List<CashReportDetailRequest>();
        public string? CreatedBy { get; set; }
    }
}
