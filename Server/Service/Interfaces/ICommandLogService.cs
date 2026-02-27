using Contracts.Models.CommandLogDTO;

namespace Service.Interfaces;

public interface ICommandLogService
{
    Task<CommandLogDTO> createCommandLogAsync(CommandLogDTO commandLog);
    Task<CommandLogDTO> GetAllCommandLogByFarmId(string farmId);
}