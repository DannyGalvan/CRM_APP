using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ValidationFailure = FluentValidation.Results.ValidationFailure;
using System.Text.Json;
using Entities.Response;
using Entities.Configurations;
using Business.Mappers;
using MongoDB.Driver;
using Entities.Models;
using MongoDB.Bson;
using Microsoft.OpenApi.Models;
using Humanizer;
using Entities.Interfaces;
using BC = BCrypt.Net;
using AutoMapper.EquivalencyExpression;
using Serilog;
using Serilog.Extensions.Logging;
using System.Security.Claims;
using Entities.Context;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using Dashboard_React.Server.Filters;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Obtain the environment current (Development, Production, etc.)
string environment = builder.Environment.EnvironmentName;

// Configure the ConfigurationBuilder y load the configurations del archive appsettings.json
IConfigurationRoot configuration = new ConfigurationBuilder()
                                   .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                   .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true) // Load base file appsettings.json
                                   .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true) // Load environment-specific file
                                   .AddEnvironmentVariables()
                                   .Build();

//Add the configuration to the builder
IConfigurationSection appSettingsSection = configuration.GetSection("AppSettings");
IConfigurationSection mongoConnectionSection = configuration.GetSection("MongoConnection");
IConfigurationSection policySettingsSection = configuration.GetSection("PolicySettings");

PolicySettings policySettings = policySettingsSection.Get<PolicySettings>()!;
AppSettings appSettingsConfig = appSettingsSection.Get<AppSettings>()!;
MongoConnection mongoConnection = mongoConnectionSection.Get<MongoConnection>()!;
builder.Services.Configure<AppSettings>(appSettingsSection);
builder.Services.Configure<MongoConnection>(mongoConnectionSection);

//Add the HttpContextAccessor
builder.Services.AddHttpContextAccessor();

//Add the DbContexts
builder.Services.AddContextGroup();

//Add services injected
builder.Services.AddServicesGroup();

//Add validations injected
builder.Services.AddValidationsGroup();

//Add the Cache in memory
builder.Services.AddMemoryCache();

//Add JWT
builder.Services.AddAuthentication(d =>
{
    d.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    d.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
       .AddJwtBearer(d =>
       {
           byte[] key = Encoding.ASCII.GetBytes(appSettingsConfig.Secret);

           d.RequireHttpsMetadata = false;
           d.SaveToken = true;
           d.TokenValidationParameters = new TokenValidationParameters
           {
               ValidateIssuerSigningKey = true,
               IssuerSigningKey = new SymmetricSecurityKey(key),
               ValidateIssuer = false,
               ValidateAudience = false,
           };
           d.Events = new JwtBearerEvents
           {
               OnAuthenticationFailed = context =>
               {
                   if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                   {
                       context.Response.Headers.Append("Token-Expired", "true");
                   }
                   return Task.CompletedTask;
               },
               OnChallenge = context =>
               {
                   context.HandleResponse();
                   context.Response.StatusCode = 401;
                   context.Response.ContentType = "application/json";

                   string? result = JsonSerializer.Serialize(
                        new Response<string>()
                        {
                            Success = false,
                            Message = "Unauthorized, you not many authorization to path",
                            Data = null
                        });

                   return context.Response.WriteAsync(result);
               }
           };
       });

builder.Services.AddAuthorization(options =>
{
    IOptions<MongoConnection> mongoConnectionOptions = new OptionsWrapper<MongoConnection>(mongoConnection);

    ICRMContext bd = new CRMContext(mongoConnectionOptions);

    IMongoCollection<Operation> Operations = bd.Database.GetCollection<Operation>(typeof(Operation).Name.Pluralize());

    var operations = Operations.Find(FilterDefinition<Operation>.Empty).ToList();

    foreach (Operation operation in operations)
    {

        if (operation.Policy.Contains(policySettings.ContainsList) && operation.Policy != policySettings.NotEqualList)
        {
            // Agrega una política personalizada que permita cualquiera de los claims
            options.AddPolicy(operation.Policy, policy =>
            {
                policy.Requirements.Add(new MultipleClaimsRequirement(
                [
                    new KeyValuePair<string, string>(ClaimTypes.AuthorizationDecision, operation.Id.ToString()),
                    new KeyValuePair<string, string>(ClaimTypes.AuthorizationDecision, policySettings.EqualValue)
                ]));
            });
        }
        else
        {
            options.AddPolicy(operation.Policy, policy => policy.RequireClaim(claimType: ClaimTypes.AuthorizationDecision, operation.Id.ToString()));
        }        
    }
});

builder.Services.AddSingleton<IAuthorizationHandler, MultipleClaimsHandler>();

//Add AutoMapper
builder.Services.AddAutoMapper(options =>
{
    options.AddProfile(new MappingProfile(builder.Environment));
    options.AddCollectionMappers();
});

//Add FluentValidation to response errors of the controllers
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.SuppressModelStateInvalidFilter = false;
        options.InvalidModelStateResponseFactory = context =>
        {
            List<ValidationFailure> failures = [];

            context.ModelState.ToList().ForEach(state =>
            {
                ModelStateEntry? value = state.Value;

                IEnumerable<ValidationFailure>? errors = value?.Errors.ToList().Select(e => new ValidationFailure(state.Key, e.ErrorMessage, value.AttemptedValue));

                if (errors != null)
                    failures.AddRange(errors);
            });

            var result = new Response<List<ValidationFailure>>()
            {
                Success = false,
                Message = "La peticion no es valida, contiene errores, porfavor revise",
                Data = failures
            };

            return new BadRequestObjectResult(result);
        };
    });

//Add Serilog.Sink.MongoDB to log in MongoDB
builder.Services.AddLogging(loggingBuilder =>
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

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Encabezado de autorización JWT utilizando el esquema Portador."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Create a sa User if not exists to start the application
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
ILogger<Program>? _logger = services.GetRequiredService<ILogger<Program>>();

if (app.Environment.IsDevelopment())
{
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapFallbackToFile("/index.html");
}

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

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();