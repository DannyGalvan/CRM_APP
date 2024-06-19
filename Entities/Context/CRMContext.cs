using Entities.Configurations;
using Entities.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;

namespace Entities.Context
{
    public class CRMContext : ICRMContext
    {
        public IMongoDatabase Database { get; private set; }

        public CRMContext(IOptions<MongoConnection> options)
        {
            MongoConnection mongoConnection = options.Value;

            UserMongoConnection conn = new()
            {
                ConnectionString = $"{mongoConnection.BaseURL}{mongoConnection.User}:{mongoConnection.Password}@{mongoConnection.Server}:{mongoConnection.Port}",
                Database = mongoConnection.Database
            };

            var mongoClientSettings = MongoClientSettings.FromConnectionString($"{conn.ConnectionString}/{conn.Database}");

            mongoClientSettings.ClusterConfigurator = cb =>
            {
                cb.Subscribe<CommandStartedEvent>(e =>
                {
                   Console.WriteLine($"{e.CommandName} - {e.Command.ToJson()}");
                });
            };

            MongoClient client = new(mongoClientSettings);
            Database = client.GetDatabase(conn.Database);
        }
    }
}
