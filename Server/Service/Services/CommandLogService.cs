using Contracts.Models.CommandLogDTO;
using Dataaccess.Repository.Interfaces;
using Service.Interfaces;
using Service.Mapper;
using service.Exceptions;

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
        CommandLogValidator.ValidateCreate(commandLog);

        var entity = _commandLogMapper.ToEntity(commandLog);

        await _commandLogRepository.AddAsync(entity);
        await _commandLogRepository.SaveChangesAsync();

        return _commandLogMapper.ToDto(entity);
    }

    public async Task<List<CommandLogDTO>> GetAllCommandLogByFarmId(string farmId)
    {
        CommandLogValidator.ValidateFarmId(farmId);

        var entities = await _commandLogRepository.GetAllCommandLogByFarmId(farmId);
        var result = entities.Select(e => _commandLogMapper.ToDto(e)).ToList();

        CommandLogValidator.ValidateCommandLogResult(result, $"farm '{farmId}'");

        return result;
    }

    public async Task<List<CommandLogDTO>> GetCommandLogByTurbineId(string turbineId, string commandLogId)
    {
        CommandLogValidator.ValidateTurbineId(turbineId);

        var entities = await _commandLogRepository.GetAllCommandLogByTurbineId(turbineId);
        var result = entities.Select(e => _commandLogMapper.ToDto(e)).ToList();

        CommandLogValidator.ValidateCommandLogResult(result, $"turbine '{turbineId}'");

        return result;
    }
}