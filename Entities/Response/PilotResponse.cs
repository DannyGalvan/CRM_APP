
namespace Entities.Response
{
    public class PilotResponse
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? LastName { get; set; }
        public string? License { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int? State { get; set; } = 1;
        public string? CreatedAt { get; set; }
        public string? UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
