using Entities.Configurations;
using Serilog;
using Serilog.Extensions.Logging;

namespace Dashboard_React.Server.Containers
{
    public static class LoggerPersistConfiguration
    {
        public static IServiceCollection AddLoggerConfiguration(this IServiceCollection services, MongoConnection mongoConnection, IConfigurationRoot configuration)
        {
            //Add Serilog.Sink.MongoDB to log in MongoDB
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(configuration.GetSection("Logging"));
                UserMongoConnection conn = new()
                {
                    ConnectionString = $"{mongoConnection.BaseURL}{mongoConnection.User}:{mongoConnection.Password}@{mongoConnection.Server}:{mongoConnection.Port}",
                    Database = mongoConnection.Database
                };

                var log = new LoggerConfiguration()
                    .WriteTo.MongoDBBson($"{conn.ConnectionString}/{conn.Database}")
                    .CreateLogger();

                loggingBuilder.AddProvider(new SerilogLoggerProvider(log));
            });

            return services;
        }
    }
}
