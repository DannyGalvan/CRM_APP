

namespace Entities.Request
{
    public class BulkRouteDetailRequest
    {
        public List<RouteDetailRequest> RouteDetails { get; set; } = new List<RouteDetailRequest>();
        public string? CreatedBy { get; set; }
    }
}
