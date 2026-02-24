using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;

namespace Dataaccess.Repository;

public class UserRepository: IUserRepository
{
    public Task<User?> GetByIdAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<User>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public IQueryable<User> AsQueryable()
    {
        throw new NotImplementedException();
    }

    public Task AddAsync(User entity)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(User entity)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(User entity)
    {
        throw new NotImplementedException();
    }

    public Task SaveChangesAsync()
    {
        throw new NotImplementedException();
    }

    public Task<User> GetUserByUsernameAsync(string username)
    {
        throw new NotImplementedException();
    }
}