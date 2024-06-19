using MongoDB.Driver;

namespace Entities.Interfaces
{
    public interface IMongoContext
    {
        IMongoDatabase Database { get; }
        void GetConnection();
    }
}
