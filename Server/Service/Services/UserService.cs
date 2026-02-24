using Contracts.Models;
using Contracts.Models.UserDTO;
using Service.Interfaces;
using Sieve.Models;

namespace Service.Services;

public class UserService: IUserService
{
    public Task<UserDTO?> GetByIdAsync(string id)
    {
        throw new NotImplementedException();
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

    public Task<AuthResponseDTO?> LoginAsync(LoginRequestDTO request)
    {
        throw new NotImplementedException();
    }
}