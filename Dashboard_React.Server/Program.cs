using Entities.Configurations;
using Dashboard_React.Server.Containers;

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

//Add services injected
builder.Services.AddServicesGroup();

//Add the Singleton services
builder.Services.AddSingletonGroup(builder);

//Add the DbContexts
builder.Services.AddContextGroup();

//Add JWT
builder.Services.AddJwtConfiguration(appSettingsConfig, policySettings, mongoConnection);

//Add validations injected
builder.Services.AddValidationsGroup();

//Add the Logger
builder.Services.AddLoggerConfiguration(mongoConnection, configuration);

//Add the Controllers configuration
builder.Services.AddControllersConfiguration();

//Add the Swagger configuration
builder.Services.AddSwaggerConfiguration();

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