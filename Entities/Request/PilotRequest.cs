using System.ComponentModel.DataAnnotations;

namespace Entities.Request
{
    public class PilotRequest
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? LastName { get; set; }
        public string? License { get; set; }
        [Phone]
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? State { get; set; } = 1;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
