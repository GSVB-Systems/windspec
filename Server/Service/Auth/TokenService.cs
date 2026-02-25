using System.Security.Claims;
using System.Text;
using Dataaccess.Repository.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Service.Auth;

public class TokenService
{
    private readonly IConfiguration _config;
    private readonly JwtSettings _settings;

    public TokenService(IConfiguration config, IOptions<JwtSettings> settings)
    {
        _config = config;
    }

    public const string SignatureAlgorithm = SecurityAlgorithms.HmacSha512;

    public string CreateToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserID),
            new Claim(ClaimTypes.Name, user.Username),
        };
        
        var secret = _config.GetSection("Jwt").GetValue<string>("Secret") ?? throw new InvalidOperationException("JWT Key not configured");
        var key = Encoding.UTF8.GetBytes(secret);
        var issuer = _config.GetSection("Jwt").GetValue<string>("Issuer");
        var audience = _config.GetSection("Jwt").GetValue<string>("Audience");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SignatureAlgorithm
            ),
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = issuer,
            Audience = audience
        };
        var tokenHandler = new JsonWebTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return token;
    }



    public static TokenValidationParameters ValidationParameters(IConfiguration config)
    {
        var secret = config.GetSection("Jwt").GetValue<string>("Secret") ?? throw new InvalidOperationException("JWT Key not configured");
        var key = Encoding.UTF8.GetBytes(secret);
        var issuer = config.GetSection("Jwt").GetValue<string>("Issuer");
        var audience = config.GetSection("Jwt").GetValue<string>("Audience");
        return new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidAlgorithms = [SignatureAlgorithm],
            ValidateIssuerSigningKey = true,
            TokenDecryptionKey = null,
            ValidateIssuer = !string.IsNullOrWhiteSpace(issuer),
            ValidateAudience = !string.IsNullOrWhiteSpace(audience),
            ValidateLifetime = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            ClockSkew = TimeSpan.Zero,
        };
    }
}