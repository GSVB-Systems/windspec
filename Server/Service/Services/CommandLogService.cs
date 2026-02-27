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
    
    public async Task<CommandLogDTO> createCommandLogAsync(CommandLogDTO commandLog)
    {
        var entity = _commandLogMapper.ToEntity(commandLog);

        await _commandLogRepository.AddAsync(entity);
        await _commandLogRepository.SaveChangesAsync();

        var DTOResult = _commandLogMapper.ToDto(entity);

        return DTOResult;
    }

    public Task<CommandLogDTO> GetAllCommandLogByFarmId(string farmId)
    {
        throw new NotImplementedException();
    }
}