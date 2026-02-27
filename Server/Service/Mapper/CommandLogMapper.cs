using Contracts.Models.CommandLogDTO;
using Dataaccess.Repository.Entities;

namespace Service.Mapper;

public class CommandLogMapper
{
    public CommandLogDTO ToDto(CommandLog commandLog)
    {
        return new CommandLogDTO
        {
            turbineId = commandLog.turbineId,
            farmId = commandLog.farmId,
            action = commandLog.action,
            reason = commandLog.reason,
            timestamp = commandLog.timestamp,
            angle = commandLog.angle,
            value = commandLog.value
        };
    }

    public CommandLog ToEntity(CommandLogDTO commandLog)
    {
        return new CommandLog
        {
            turbineId = commandLog.turbineId,
            farmId = commandLog.farmId,
            action = commandLog.action,
            reason = commandLog.reason,
            timestamp = commandLog.timestamp,
            angle = commandLog.angle,
            value = commandLog.value
        };
    }
}