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
using Microsoft.OpenApi.Models;
using Humanizer;
using Entities.Interfaces;
using AutoMapper.EquivalencyExpression;
using Serilog;
using Serilog.Extensions.Logging;
using System.Security.Claims;
using Entities.Context;
using Microsoft.Extensions.Options;
using Dashboard_React.Server.Filters;
using Dashboard_React.Server.Containers;
using Microsoft.Extensions.Primitives;

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
                   if (context.Exception.GetType() != typeof(SecurityTokenExpiredException)) return Task.CompletedTask;
                   StringValues assert = new("true");

                   context.Response.Headers.Append("Token-Expired", assert);
                   return Task.CompletedTask;
               },
               OnChallenge = context =>
               {
                   context.HandleResponse();
                   context.Response.StatusCode = 401;
                   context.Response.ContentType = "application/json";

                   var result = JsonSerializer.Serialize(
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

    var operationsCollection = bd.Database.GetCollection<Operation>(nameof(Operation).Pluralize());

    var operations = operationsCollection.Find(FilterDefinition<Operation>.Empty).ToList();

    foreach (var operation in operations)
    {

        if (operation.Policy.Contains(policySettings.ContainsList) && operation.Policy != policySettings.NotEqualList)
        {
            // Add a custom policy that allows any of the claims.
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
                Message = "La petición no es valida, contiene errores, porfavor revise",
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

WebApplication app = builder.Build();

Initializer.Run(app);

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