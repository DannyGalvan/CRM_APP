using Entities.Models;


namespace Entities.Response
{
    public class RouteResponse
    {
        public string Id { get; set; } = string.Empty;
        public string PilotId { get; set; } = string.Empty;
        public string Observations { get; set; } = string.Empty;
        public int State { get; set; } = 1;
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }  
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }


        public virtual Pilot? Pilot { get; set; }
    }
}
