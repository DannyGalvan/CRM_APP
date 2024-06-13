
namespace Entities.Request
{
    public class FilterDefinition
    {
        public string Field { get; set; } = string.Empty;
        public string Operator { get; set; } = string.Empty;
        public object Value { get; set; } = string.Empty;
    }
}
