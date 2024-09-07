using Entities.Configurations;
using Entities.Interfaces;
using Entities.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Humanizer;
using BC = BCrypt.Net;

namespace Dashboard_React.Server.Containers
{
    public static class Initializer
    {
        public static void Run(WebApplication app)
        {
            
            using IServiceScope scope = app.Services.CreateScope();
            IServiceProvider services = scope.ServiceProvider;
            IConfigurationSection configuration = services.GetRequiredService<IConfiguration>().GetSection("InitialDataConfig");
            ILogger<Program> logger = services.GetRequiredService<ILogger<Program>>();
            InitialDataConfig initialDataConfig = configuration.Get<InitialDataConfig>()!;

            if (app.Environment.IsDevelopment())
            {
                // Create a sa User if not exists to start the application in development
                try
                {
                    var dbContext = services.GetRequiredService<ICrmContext>();

                    string collectionName = nameof(User).Pluralize();

                    IMongoCollection<User> users = dbContext.Database.GetCollection<User>(collectionName);

                    User? manager = users.Find(u => u.Email == initialDataConfig.EmailManager).FirstOrDefault();

                    if (manager == null)
                    {
                        users.InsertOne(new User
                        {
                            Id = ObjectId.Parse(initialDataConfig.IdManager),
                            Email = initialDataConfig.EmailManager,
                            Password = BC.BCrypt.HashPassword(initialDataConfig.PasswordManager),
                            Name = initialDataConfig.NameManager,
                            LastName = initialDataConfig.LastNameManager,
                            UserName = initialDataConfig.UserNameManager,
                            Number = initialDataConfig.NumberManager,
                            Active = initialDataConfig.ActiveManager,
                            Confirm = initialDataConfig.ConfirmManager,
                            Database = initialDataConfig.DatabaseManager,
                            ConnectionString = initialDataConfig.ConnectionStringManager,
                            CreatedBy = ObjectId.Parse(initialDataConfig.IdManager),
                        });
                    }

                    logger.LogInformation("Aplicacion Iniciada en Desarrollo con Exito!!!");
                }
                catch (Exception ex)
                {
                    logger.LogCritical(ex, "Error al crear SA: {mensaje}", ex.Message);

                    throw new Exception($"Error al crear SA: {ex.Message}");
                }
            }
            else
            {
                logger.LogInformation("Aplicación Iniciada en Producción con Exito!!!");
            }

            // Middleware to handle errors
            app.Use(async (_, next) =>
            {
                try
                {
                    await next();
                }
                catch (Exception ex)
                {
                    logger.LogCritical(ex, "Error en la aplicación: {mensaje}", ex.Message);
                    throw;
                }
            });
        }
    }
}
