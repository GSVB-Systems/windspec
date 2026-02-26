using Contracts.Models.TelemetryDTO;
using Dataaccess.Repository.Entities;


namespace Service.Interfaces;

public interface ITelemetryService
{

    Task<Telemetry> CreateTelemetryAsync(TelemetryDTO telemetry);
    
}