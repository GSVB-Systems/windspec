using Contracts.Models;
using Contracts.Models.UserDTO;
using Dataaccess.Repository.Interfaces;
using Microsoft.Extensions.Logging;
using Service.Auth;
using Service.Interfaces;
using Service.Mapper;
using Sieve.Models;
using Sieve.Services;

namespace Service.Services;

public class UserService: IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ISieveProcessor _sieve;
    private readonly PasswordService _passwordService;
    private readonly TokenService _TokenService;
    private IUserService _userServiceImplementation;

    public UserService(IUserRepository userRepository, ISieveProcessor sieve, PasswordService passwordService, TokenService TokenService)
    {
        _userRepository = userRepository;
        _sieve = sieve;
        _passwordService = passwordService;
        _TokenService = TokenService;
    }
    
    public async Task<UserDTO?> GetByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return null;

        var entity = await _userRepository.GetByIdAsync(id);
        return entity is null ? null : UserMapper.ToDto(entity);
    }

    public Task<PagedResult<UserDTO>> GetAllAsync(SieveModel? parameters)
    {
        throw new NotImplementedException();
    }

    public Task<UserDTO> CreateAsync(UserCreateDTO createDto)
    {
        throw new NotImplementedException();
    }

    public Task<UserDTO?> UpdateAsync(string id, UserUpdateDTO updateDto)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<string> LoginAsync(LoginRequestDTO request)
    {
        if (request is null) throw new ArgumentNullException(nameof(request));
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        var user = await _userRepository.GetUserByUsernameAsync(request.Username);
        if (user is null)
            return null;

        var valid = _passwordService.VerifyPassword(request.Password, user.PasswordHash);
        if (!valid)
            return null;

        var token = _TokenService.CreateToken(user);
        return token;
    }
}