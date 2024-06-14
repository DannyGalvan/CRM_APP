using Entities.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ValidationFailure = FluentValidation.Results.ValidationFailure;
using System.Text.Json;
using Entities.Response;
using Entities.Configurations;
using Business.Interfaces;
using Business.Repository;
using Business.Services;
using AutoMapper;
using Business.Mappers;
using MongoDB.Driver;
using Entities.Models;
using MongoDB.Bson;
using Entities.Request;
using Microsoft.OpenApi.Models;
using Humanizer;

var builder = WebApplication.CreateBuilder(args);

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
AppSettings appSettingsConfig = appSettingsSection.Get<AppSettings>()!;
MongoConnection mongoConnection = mongoConnectionSection.Get<MongoConnection>()!;
builder.Services.Configure<AppSettings>(appSettingsSection);
builder.Services.Configure<MongoConnection>(mongoConnectionSection);

//Add the DbContexts
builder.Services.AddScoped<CRMContext>();
builder.Services.AddScoped<MongoContext>();

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

builder.Services.AddHttpContextAccessor();

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

//mappping profiles
var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new MappingProfile());  
});

IMapper mapper = mapperConfig.CreateMapper();

//services injected
builder.Services.AddSingleton(mapper);
builder.Services.AddScoped<ISendMail, SendEmail>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICalendarEventService, CalendarEventService>();
builder.Services.AddScoped<IEntityService<Customer, CustomerRequest, ObjectId>, EntityService<Customer, CustomerRequest, ObjectId>>();  
builder.Services.AddScoped<IEntityService<Product, ProductRequest, ObjectId>, EntityService<Product, ProductRequest, ObjectId>>();
builder.Services.AddScoped<IEntityService<Collection, CollectionRequest, ObjectId>, EntityService<Collection, CollectionRequest, ObjectId>>();
builder.Services.AddScoped<ICatalogueService, CatalogueService>();


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

builder.Services.AddMemoryCache();

var app = builder.Build();

// Create a sa User if not exists to start the application
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;

        try
        {
            string emailManager = "pruebas.test29111999@gmail.com";

            var dbContext = services.GetRequiredService<CRMContext>();

            string collectionName = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = dbContext.Database.GetCollection<User>(collectionName);

            User? manager = Users.Find(u => u.Email == emailManager).FirstOrDefault();

            if (manager == null)
            {
                Users.InsertOne(new User
                {
                    Id = ObjectId.Parse("662754d99f4e1bf2407306ba"),
                    Email = emailManager,
                    Password = "$2b$10$00.zgcXUrvbb45xlDS2Y5eXkMb.Ktx/XcQDOyMAbJv2CxWnD2Wpp.",
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

            Console.WriteLine("Aplicacion Iniciada en Desarrollo con Exito!!!");
        }
        catch (Exception ex)
        {
            throw new Exception($"Error al crear SA: {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine("Aplicacion Iniciada en Produccion con Exito!!!");
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

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();