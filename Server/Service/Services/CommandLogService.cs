using Contracts.Models.CommandLogDTO;
using Dataaccess.Repository.Interfaces;
using Service.Interfaces;
using Service.Mapper;

namespace Service.Services;

public class CommandLogService : ICommandLogService
{
    private readonly CommandLogMapper _commandLogMapper;
    private readonly ICommandLogRepository _commandLogRepository;

    public CommandLogService(CommandLogMapper commandLogMapper, ICommandLogRepository commandLogRepository){
        _commandLogMapper = commandLogMapper;
        _commandLogRepository = commandLogRepository;
        
    }
    
    public async Task<CommandLogDTO> CreateCommandLogAsync(CommandLogDTO commandLog)
    {
        var entity = _commandLogMapper.ToEntity(commandLog);

        await _commandLogRepository.AddAsync(entity);
        await _commandLogRepository.SaveChangesAsync();

        var DTOResult = _commandLogMapper.ToDto(entity);

        return DTOResult;
    }

    public async  Task<List<CommandLogDTO>> GetAllCommandLogByFarmId(string farmId)
    {
            var entities = await _commandLogRepository.GetAllCommandLogByFarmId(farmId);
            var DTOResult = entities.Select(e => _commandLogMapper.ToDto(e)).ToList();
            return DTOResult;
    }

    public Task<List<CommandLogDTO>> GetCommandLogByTurbineId(string turbineId, string commandLogId)
    {
        var entities = _commandLogRepository.GetAllCommandLogByTurbineId(turbineId).Result;
        var DTOResult = entities.Select(e => _commandLogMapper.ToDto(e)).ToList();
        return Task.FromResult(DTOResult);
    }
}