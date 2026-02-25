using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Dataaccess.Repository;

public class UserRepository: Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public Task<User> GetUserByUsernameAsync(string username)
    {
        var usernameCorrect = _dbSet.FirstOrDefaultAsync(u => u.Username == username);
        Console.Write(usernameCorrect);
        return usernameCorrect;
    }
}