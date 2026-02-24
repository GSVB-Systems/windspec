using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Npgsql;

namespace Dataaccess;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        Env.Load();

        var conn = Environment.GetEnvironmentVariable("ConnectionStringsDefaultConnection")
                   ?? Environment.GetEnvironmentVariable("CONNECTION_STRING")
                   ?? Environment.GetEnvironmentVariable("DATABASE_URL");

        if (string.IsNullOrWhiteSpace(conn))
            throw new InvalidOperationException("Set ConnectionStringsDefaultConnection, CONNECTION_STRING or DATABASE_URL in environment for design-time DbContext.");

        if (conn.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
            conn = BuildConnectionStringFromDatabaseUrl(conn);

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(conn, b => b.EnableRetryOnFailure());

        return new AppDbContext(optionsBuilder.Options);
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
}