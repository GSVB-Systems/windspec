using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Dataaccess.Repository;

public class CommandLogRepository : Repository<CommandLog>, ICommandLogRepository
{
    public CommandLogRepository(AppDbContext context) : base(context)
    {
    }
    
    public async Task<IEnumerable<CommandLog>> GetAllCommandLogByFarmId(string farmId)
    {
        return await _dbSet.Where(c => c.farmId == farmId).ToListAsync();
    }

    public async Task<IEnumerable<CommandLog>> GetAllCommandLogByTurbineId(string turbineId)
    {
        return await _dbSet.Where(c => c.turbineId == turbineId).ToListAsync();
    }
}