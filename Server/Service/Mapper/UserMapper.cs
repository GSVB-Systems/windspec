using Dataaccess.Repository.Entities;
using Contracts.Models.UserDTO;

namespace Service.Mapper;

public static class UserMapper
{
    public static UserDTO ToDto(User user)
    {
        return new UserDTO
        {
            UserID = user.UserID,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Username = user.Username
        };
    }
}

