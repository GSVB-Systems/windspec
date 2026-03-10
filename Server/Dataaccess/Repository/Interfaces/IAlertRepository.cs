using Dataaccess.Repository.Entities;

namespace Dataaccess.Repository.Interfaces;

public interface IAlertRepository : IRepository<Alert>
{
    Task<IEnumerable<Alert>> GetAlertByFarmId(string farmId);
    Task<IEnumerable<Alert>> GetAlertByTurbineId(string turbineId);
}