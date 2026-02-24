using Dataaccess.Repository.Entities;

namespace Dataaccess.Repository.Interfaces;

public interface IUserRepository: IRepository<User>
{
    Task<User> GetUserByUsernameAsync(string username);
    
}