namespace Contracts.Models.UserDTO;

public class AuthResponseDTO
{
    public string AccessToken { get; set; } = default!;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresInSeconds { get; set; }
}