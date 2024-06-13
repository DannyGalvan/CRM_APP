using MongoDB.Bson;

namespace Entities.Interfaces
{
    public interface ICatalogue
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
