
using MongoDB.Driver;

namespace Entities.Interfaces
{
    public interface ICrmContext
    {
        IMongoDatabase Database { get; }
    }
}
