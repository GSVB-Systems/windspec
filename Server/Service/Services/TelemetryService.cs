using Contracts.Models.TelemetryDTO;
using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;
using Service.Interfaces;
using Service.Mapper;

namespace Service.Services;

public class TelemetryService : ITelemetryService
{
    
    private readonly ITelemetryRepository _telemetryRepository;
    private readonly TelemetryMapper _telemetryMapper;
    
    public TelemetryService(ITelemetryRepository repository, TelemetryMapper telemetryMapper)
    {
        _telemetryRepository = repository;
        _telemetryMapper = telemetryMapper;
        
    }
    
    public async Task<TelemetryDTO> CreateTelemetryAsync(TelemetryDTO telemetry)
    {
        var entity = _telemetryMapper.ToEntity(telemetry);

        await _telemetryRepository.AddAsync(entity);
        await _telemetryRepository.SaveChangesAsync();

        var DTOResult = _telemetryMapper.ToDto(entity);

        return DTOResult;
    }
}