
namespace Entities.Request
{
    public class CustomerDirectionRequest
    {
        public string? Id { get; set; }
        public string? CustomerId { get; set; }
        public string? DepartmentId { get; set; }
        public string? MunicipalityId { get; set; }
        public string? ZoneId { get; set; }
        public string? ColonyCondominium { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public int? State { get; set; } = 1;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
