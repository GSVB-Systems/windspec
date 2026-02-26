using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Dataaccess.Repository;

public class AlertRepository : Repository<Alerts>, IAlertRepository
{
    public AlertRepository(AppDbContext context) : base(context)
    {
        
    }

    public async Task<IEnumerable<Alerts>> GetAlertsByFarmId(string farmId)
    {
        return await _dbSet.Where(a => a.farmId == farmId).ToListAsync();
        
    }

    public async Task<IEnumerable<Alerts>> GetAlertsByTurbineId(string turbineId)
    {
        return await _dbSet.Where(a => a.turbineId == turbineId).ToListAsync();
    }
}