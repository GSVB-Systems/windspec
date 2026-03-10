using Dataaccess.Repository.Entities;

namespace Dataaccess.Repository.Interfaces;

public interface ITelemetryRepository : IRepository<Telemetry>
{
    Task<IEnumerable<Telemetry>> GetTelemetryByFarmId(string farmId);
    Task<IEnumerable<Telemetry>> GetTelemetryByTurbineId(string turbineId);
}