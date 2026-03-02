using System.Net.Http.Headers;
using System.Text;
using Dataaccess;
using Dataaccess.Repository;
using Dataaccess.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using Service.Auth; // Ensure JwtSettings is imported
using Service.Interfaces;
using Service.Services;
using Service.Mapper;
using Sieve.Services;
using StackExchange.Redis;
using StateleSSE.AspNetCore.Extensions;
using DotNetEnv;
using Mqtt.Controllers;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.GroupRealtime;

namespace Api.Extension;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(
        this IServiceCollection services,
        IConfiguration configuration,
        bool addDefaultDbContext = true,
        Action<IServiceCollection>? configureOverrides = null
    )
    {
        
        // Only require the connection string when we intend to register the default DbContext
        if (addDefaultDbContext)
        {
            // Read connection string strictly from appsettings.json/appsettings.{Environment}.json
            var conn = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(conn))
                throw new InvalidOperationException(
                    "Connection string 'ConnectionStrings:DefaultConnection' was not found. Configure it in appsettings.json / appsettings.Development.json.");


            try
            {
                var csb = new NpgsqlConnectionStringBuilder(conn);
                var startupLogger = LoggerFactory.Create(lb => lb.AddConsole()).CreateLogger("Startup");
                startupLogger.LogInformation(
                    "Using PostgreSQL connection from appsettings: Host={Host};Port={Port};Database={Database};Username={Username};SslMode={SslMode}",
                    csb.Host, csb.Port, csb.Database, csb.Username, csb.SslMode);
            }
            catch
            {
                // Ignore parsing issues; EF/Npgsql will surface a useful error.
            }

            services.AddDbContext<AppDbContext>((sp, options) =>
            {
                options.UseNpgsql(conn, npgsqlOptions => npgsqlOptions.EnableRetryOnFailure());
                options.AddEfRealtimeInterceptor(sp);
            });

        }

        var jwtSection = configuration.GetSection("Jwt");
        var jwtSettings = jwtSection.Get<JwtSettings>() ?? throw new InvalidOperationException("Missing Jwt configuration.");
        if (string.IsNullOrWhiteSpace(jwtSettings.Secret))
            throw new InvalidOperationException("Jwt:Secret must be configured (appsettings.Development.json or environment variables).");

        var secretByteLength = Encoding.UTF8.GetByteCount(jwtSettings.Secret);
        if (secretByteLength < 32)
            throw new InvalidOperationException("Jwt:Secret must be at least 32 bytes (256 bits).");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = TokenService.ValidationParameters(configuration);
            });
        services.AddScoped<IUserRepository, UserRepository>();
        

        services.AddSingleton<IConnectionMultiplexer>(sp =>
            ConnectionMultiplexer.Connect("localhost:6379"));
        services.AddRedisSseBackplane();
        services.AddEfRealtime();
        services.AddGroupRealtime();
        services.AddMqttControllers();
        services.AddControllers();
        services.AddOpenApiDocument();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITelemetryRepository, TelemetryRepository>();
        services.AddScoped<TelemetryMapper>();
        services.AddScoped<ITelemetryService, TelemetryService>();
        services.AddScoped<IAlertRepository, AlertRepository>();
        services.AddScoped<AlertMapper>();
        services.AddScoped<IAlertService, AlertService>();
        services.AddScoped<ICommandLogRepository, CommandLogRepository>();
        services.AddScoped<CommandLogMapper>();
        services.AddScoped<ICommandLogService, CommandLogService>();
        services.AddScoped<PasswordService>();
        services.AddScoped<ISieveProcessor, SieveProcessor>();
        services.AddScoped<JwtSettings>();
        services.AddScoped<TokenService>();
        services.AddAuthorization();
        
        // Allow tests (or other callers) to override registrations, e.g., swap DbContext with a test container
        configureOverrides?.Invoke(services);

        return services;
    }
}