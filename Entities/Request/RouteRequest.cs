namespace Entities.Request
{
    public class RouteRequest
    {
        public string? Id { get; set; }
        public string? PilotId { get; set; }
        public string? Observations { get; set; }
        public int? State { get; set; } = 1;
        public List<RouteDetailRequest> RouteDetails { get; set; } = new List<RouteDetailRequest>();
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
