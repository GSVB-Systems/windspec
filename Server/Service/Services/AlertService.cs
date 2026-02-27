using Contracts.Models.AlertDTO;
using Dataaccess.Repository.Interfaces;
using Service.Interfaces;
using Service.Mapper;

namespace Service.Services;

public class AlertService : IAlertService
{
    private readonly IAlertRepository _alertRepository;
    private readonly AlertMapper _alertMapper;
    
    public AlertService(IAlertRepository repository, AlertMapper alertMapper)
    {
        _alertRepository = repository;
        _alertMapper = alertMapper;

    }
    
    public async Task<AlertDTO> CreateAlertAsync(AlertDTO alert)
    {
        var entity = _alertMapper.ToEntity(alert);

        await _alertRepository.AddAsync(entity);
        await _alertRepository.SaveChangesAsync();

        var DTOResult = _alertMapper.ToDto(entity);

        return DTOResult;
    }
}