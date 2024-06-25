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
            ILogger<Program> _logger = services.GetRequiredService<ILogger<Program>>();

            if (app.Environment.IsDevelopment())
            {
                // Create a sa User if not exists to start the application in development
                try
                {
                    string emailManager = "pruebas.test29111999@gmail.com";

                    var dbContext = services.GetRequiredService<ICRMContext>();

                    string collectionName = typeof(User).Name.Pluralize();

                    IMongoCollection<User> Users = dbContext.Database.GetCollection<User>(collectionName);

                    User? manager = Users.Find(u => u.Email == emailManager).FirstOrDefault();

                    if (manager == null)
                    {
                        Users.InsertOne(new User
                        {
                            Id = ObjectId.Parse("662754d99f4e1bf2407306ba"),
                            Email = emailManager,
                            Password = BC.BCrypt.HashPassword("Broiler-Charbroil4"),
                            Name = "Systema",
                            LastName = "Admin",
                            UserName = "MANAGER",
                            Number = "51995142",
                            Active = true,
                            Confirm = true,
                            Database = "Dashboard_Data",
                            ConnectionString = "mongodb://CRM_DATA:crm_data_8955@localhost:27017",
                            CreatedBy = ObjectId.Parse("662754d99f4e1bf2407306ba"),
                        });
                    }

                    _logger.LogInformation("Aplicacion Iniciada en Desarrollo con Exito!!!");
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Error al crear SA: {mensaje}", ex.Message);

                    throw new Exception($"Error al crear SA: {ex.Message}");
                }
            }
            else
            {
                _logger.LogInformation("Aplicacion Iniciada en Produccion con Exito!!!");
            }


            // Middleware para manejar errores
            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Error en la aplicacion: {mensaje}", ex.Message);
                    throw;
                }
            });
        }
    }
}
