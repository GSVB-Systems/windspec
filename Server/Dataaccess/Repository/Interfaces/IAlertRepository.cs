using Dataaccess.Repository.Entities;

namespace Dataaccess.Repository.Interfaces;

public interface IAlertRepository : IRepository<Alerts>
{
    Task<IEnumerable<Alerts>> GetAlertsByFarmId(string farmId);
    Task<IEnumerable<Alerts>> GetAlertsByTurbineId(string turbineId);
}