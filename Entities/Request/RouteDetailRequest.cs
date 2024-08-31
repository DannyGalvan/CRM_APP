namespace Entities.Request
{
    public class RouteDetailRequest
    {
        public string? Id { get; set; }
        public string? RouteId { get; set; }
        public string? OrderId { get; set; }
        public int? State { get; set; } = 1;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
