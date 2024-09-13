using Entities.Interfaces;
using Entities.Models;
namespace Entities.Request
{
    public class CashReportDetailRequest
    {
        public string? Id { get; set; }
        public string? CashReportId { get; set; }
        public string? OrderId { get; set; }
        public int State { get; set; } = 1;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
