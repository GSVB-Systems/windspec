using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Dataaccess.Repository;

public class TelemetryRepository : Repository<Telemetry>, ITelemetryRepository
{
    public TelemetryRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Telemetry>> GetTelemetryByFarmId(string farmId)
    {
        return await _dbSet.Where(t => t.farmId == farmId).ToListAsync();
    }

    public async Task<IEnumerable<Telemetry>> GetTelemetryByTurbineId(string turbineId)
    {
        return await _dbSet.Where(t => t.turbineId == turbineId).ToListAsync();
    }
}