using Contracts.Models.UserDTO;
using Dataaccess.Repository.Entities;

namespace Service.Interfaces;

public interface IUserService : IService<UserDTO, UserCreateDTO, UserUpdateDTO>
{
    Task<AuthResponseDTO?> LoginAsync(LoginRequestDTO request);
}