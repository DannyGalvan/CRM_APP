namespace Entities.Request
{
    public class CashReportConvert
    {
        public Dictionary<string, decimal> TotalByPaymentTypes { get; set; } = new Dictionary<string, decimal>();
        public int OrdersQuantity { get; set; }
        public decimal Total { get; set; }
    }
}
