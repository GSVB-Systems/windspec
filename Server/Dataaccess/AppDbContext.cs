using Dataaccess.Repository.Entities;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Dataaccess;

public class AppDbContext : DbContext
{
     public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> User { get; set; } = null!;
    public DbSet<Telemetry> Telemetry { get; set; } = null!;
    
    

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured)
            return;

        Env.Load();


        var conn = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                   ?? Environment.GetEnvironmentVariable("CONNECTION_STRING")
                   ?? Environment.GetEnvironmentVariable("DATABASE_URL");

        if (string.IsNullOrWhiteSpace(conn))
            throw new InvalidOperationException("No database connection string found in environment (ConnectionStrings__DefaultConnection, CONNECTION_STRING or DATABASE_URL).");

        if (conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
            conn = BuildConnectionStringFromDatabaseUrl(conn);

        optionsBuilder.UseNpgsql(conn, b => b.EnableRetryOnFailure());
    }

    private static string BuildConnectionStringFromDatabaseUrl(string databaseUrl)
    {
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':', StringSplitOptions.RemoveEmptyEntries);
        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Username = userInfo.Length > 0 ? userInfo[0] : string.Empty,
            Password = userInfo.Length > 1 ? userInfo[1] : string.Empty,
            Database = uri.AbsolutePath.TrimStart('/'),
            SslMode = SslMode.Prefer,
            TrustServerCertificate = true
        };
        return builder.ToString();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(eb =>
        {
            eb.HasKey(u => u.UserID);
            eb.Property(u => u.UserID).IsRequired();
            eb.Property(u => u.Username).IsRequired();
            eb.Property(u => u.PasswordHash).IsRequired();
            eb.Property(u => u.FirstName).IsRequired();
            eb.Property(u => u.LastName).IsRequired();
            
        });
        
        modelBuilder.Entity<Telemetry>(eb =>
        {
            eb.HasKey(t => t.turbineId);
            eb.Property(t => t.turbineName).ValueGeneratedOnAdd();
            eb.Property(t => t.farmId).IsRequired();
            eb.Property(t => t.timestamp).IsRequired();
            eb.Property(t => t.windSpeed).IsRequired();
            eb.Property(t => t.windDirection).IsRequired();
            eb.Property(t => t.ambientTemperature).ValueGeneratedOnAdd();
            eb.Property(t => t.rotorSpeed).IsRequired();
            eb.Property(t => t.powerOutput).IsRequired();
            eb.Property(t => t.nacelleDirection).IsRequired();
            eb.Property(t => t.bladePitch).IsRequired();
            eb.Property(t => t.generatorTemp).ValueGeneratedOnAdd();
            eb.Property(t => t.gearboxTemp).IsRequired();
            eb.Property(t => t.vibration).IsRequired();
            eb.Property(t => t.status).IsRequired();
        });

        base.OnModelCreating(modelBuilder);
    }
}