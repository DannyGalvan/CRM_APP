
using MongoDB.Driver;

namespace Entities.Interfaces
{
    public interface ICRMContext
    {
        IMongoDatabase Database { get; }
    }
}
