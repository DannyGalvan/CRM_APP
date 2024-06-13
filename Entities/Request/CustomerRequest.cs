using System.ComponentModel.DataAnnotations;

namespace Entities.Request
{
    public class CustomerRequest
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? SecondName { get; set; }
        public string? FirstLastName { get; set; }
        public string? SecondLastName { get; set; }
        [Phone]
        public string? FirstPhone { get; set; }
        [Phone]
        public string? SecondPhone { get; set; }
        public string? Address { get; set; }
        public string? DepartmentId { get; set; }
        public string? MunicipalityId { get; set; }
        public string? ZoneId { get; set; }
        public string? Colony_Condominium { get; set; }
        public string? SocialNetworks { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
