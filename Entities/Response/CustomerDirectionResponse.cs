namespace Entities.Response
{
    public class CustomerDirectionResponse
    {
        public string Id { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string DepartmentId { get; set; } = string.Empty;
        public string MunicipalityId { get; set; } = string.Empty;
        public string ZoneId { get; set; } = string.Empty;
        public string ColonyCondominium { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int State { get; set; } = 1;
        public string CreatedAt { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;   
        public string? UpdatedBy { get; set; }
        public string? UpdatedAt { get; set; }

        public virtual CustomerResponse? Customer { get; set; }
        public virtual CatalogueResponse? Department { get; set; }
        public virtual CatalogueResponse? Municipality { get; set; }
        public virtual CatalogueResponse? Zone { get; set; }
    }
}
