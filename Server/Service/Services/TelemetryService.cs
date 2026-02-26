using Contracts.Models.TelemetryDTO;
using Dataaccess.Repository.Entities;
using Dataaccess.Repository.Interfaces;
using Service.Interfaces;
using Service.Mapper;

namespace Service.Services;

public class TelemetryService : ITelemetryService
{
    
    private readonly ITelemetryRepository _telemetryRepository;
    private readonly TelemetryMapper _mapper;
    
    public TelemetryService(ITelemetryRepository repository, TelemetryMapper mapper)
    {
        _telemetryRepository = repository;
        _mapper = mapper;
        
    }
    
    public async Task<TelemetryDTO> CreateTelemetryAsync(TelemetryDTO telemetry)
    {
        var entity = _mapper.ToEntity(telemetry);

        await _telemetryRepository.AddAsync(entity);
        await _telemetryRepository.SaveChangesAsync();

        var DTOResult = _mapper.ToDto(entity);

        return DTOResult;
    }

    
}