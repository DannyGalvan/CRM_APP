using Entities.Configurations;
using Entities.Interfaces;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using System.Security.Claims;
using Humanizer;
using Microsoft.Extensions.Hosting;

namespace Entities.Context
{
    public class MongoContext : IMongoContext
    {
        private readonly ICrmContext _crmContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly ILogger<MongoContext> _logger;
        public IMongoDatabase Database { get; private set; }
        public MongoContext(IHttpContextAccessor httpContextAccessor, ICrmContext crmContext, IMemoryCache memoryCache, IHostEnvironment env, ILogger<MongoContext> logger) {
            _crmContext = crmContext;
            _httpContextAccessor = httpContextAccessor;
            _cache = memoryCache;
            _logger = logger;

            UserMongoConnection conn = GetConnectionStringUser();

            var mongoClientSettings = MongoClientSettings.FromConnectionString($"{conn.ConnectionString}/{conn.Database}");

            if (env.IsDevelopment())
            {
                mongoClientSettings.ClusterConfigurator = cb =>
                {
                    cb.Subscribe<CommandStartedEvent>(e =>
                    {
                        Console.WriteLine($"{e.CommandName} - {e.Command.ToJson()}");
                    });
                };
            }

            MongoClient client = new(mongoClientSettings);
            Database = client.GetDatabase(conn.Database);
        }

        public void GetConnection()
        {
            UserMongoConnection conn = GetConnectionStringUser();

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

        private UserMongoConnection GetConnectionStringUser()
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext ?? throw new InvalidOperationException("HttpContext is not available.");
                var userIdClaim = (httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new InvalidOperationException("User identifier claim is not available.");

                ObjectId userId = ObjectId.Parse(userIdClaim);

                if (!_cache.TryGetValue(userId, out UserMongoConnection? userMongoConnection))
                {
                    string collectionName = nameof(User).Pluralize();

                    IMongoCollection<User> users = _crmContext.Database.GetCollection<User>(collectionName);

                    User? user = users.Find(u => u.Id == userId).FirstOrDefault();

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

                    // Configure the options of the cache
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromDays(8)); // Mantener la cache durante 8 días

                    // Save the connection y cache
                    _cache.Set(userId, userMongoConnection, cacheEntryOptions);
                }

                return userMongoConnection!;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la conexión del usuario {mensaje}", ex.Message);

                return new UserMongoConnection();
            }
        }
    }
}
