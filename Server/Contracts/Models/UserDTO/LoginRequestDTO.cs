namespace Contracts.Models.UserDTO;

public class LoginRequestDTO
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}