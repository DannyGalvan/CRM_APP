using Entities.Configurations;
using Entities.Interfaces;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using System.Security.Claims;

namespace Entities.Context
{
    public class MongoContext : IMongoContext
    {
        private readonly ICRMContext _crmContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        public IMongoDatabase Database { get; private set; }
        public MongoContext(IHttpContextAccessor httpContextAccessor, ICRMContext cRMContext, IMemoryCache memoryCache) {
            _crmContext = cRMContext;
            _httpContextAccessor = httpContextAccessor;
            _cache = memoryCache;

            try
            {
                UserMongoConnection? conn = GetConnectonStringUser();

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
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public void GetConnection()
        {
            UserMongoConnection? conn = GetConnectonStringUser();

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

        private UserMongoConnection GetConnectonStringUser()
        {
            var httpContext = _httpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is not available.");
            var userIdClaim = (httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new InvalidOperationException("User identifier claim is not available.");

            ObjectId userId = ObjectId.Parse(userIdClaim);

            if (!_cache.TryGetValue(userId, out UserMongoConnection? userMongoConnection))
            {
                IMongoCollection<User> Users = _crmContext.Database.GetCollection<User>(CollectionNames.Users);

                User? user = Users.Find(u => u.Id == userId).FirstOrDefault();

                if (user == null)
                {
                    userMongoConnection = new UserMongoConnection();

                    return userMongoConnection;
                }

                userMongoConnection = new UserMongoConnection()
                {
                    ConnectionString = user.ConnectionString,
                    Database = user.Database
                };

                // Configurar las opciones de la cache
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromDays(8)); // Mantener la cache durante 8 días

                // Guardar la conexión en la cache
                _cache.Set(userId, userMongoConnection, cacheEntryOptions);
            }
           

            return userMongoConnection!;
        }
    }
}
