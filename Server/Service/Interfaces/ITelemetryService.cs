using Contracts.Models.TelemetryDTO;
using Dataaccess.Repository.Entities;


namespace Service.Interfaces;

public interface ITelemetryService
{

    Task<TelemetryDTO> CreateTelemetryAsync(TelemetryDTO telemetry);
    
}