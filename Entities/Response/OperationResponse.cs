
namespace Entities.Response
{
    public class OperationResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Policy { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string ModuleId { get; set; } = string.Empty;
        public bool IsVisible { get; set; }
    }
}
