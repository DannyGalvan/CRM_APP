using Entities.Models;

namespace Entities.Response
{
    public class RouteDetailResponse
    {
        public string Id { get; set; } = string.Empty;
        public string RouteId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public int State { get; set; } = 1;
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }

        public  Route? Route { get; set; }
        public  Order? Order { get; set; }
    }
}
