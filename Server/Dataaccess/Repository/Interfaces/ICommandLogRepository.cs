using Dataaccess.Repository.Entities;

namespace Dataaccess.Repository.Interfaces;

public interface ICommandLogRepository : IRepository<CommandLog>
{
    Task<IEnumerable<CommandLog>> GetAllCommandLogByFarmId(string farmId);
    Task<IEnumerable<CommandLog>> GetAllCommandLogByTurbineId(string turbineId);
}