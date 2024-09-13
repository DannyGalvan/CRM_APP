namespace Entities.Response
{
    public class CustomerResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string SecondName { get; set; } = string.Empty;
        public string FirstLastName { get; set; } = string.Empty;
        public string SecondLastName { get; set; } = string.Empty;
        public string FullName { get; set;} = string.Empty;
        public string FirstPhone { get; set; } = string.Empty;
        public string SecondPhone { get; set; } = string.Empty;
        public string? SocialNetworks { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
        public string? UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }
    }
}
