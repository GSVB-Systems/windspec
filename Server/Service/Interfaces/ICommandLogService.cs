using Contracts.Models.CommandLogDTO;

namespace Service.Interfaces;

public interface ICommandLogService
{
    Task<CommandLogDTO> CreateCommandLogAsync(CommandLogDTO commandLog);
    Task<List<CommandLogDTO>> GetAllCommandLogByFarmId(string farmId);
    Task<List<CommandLogDTO>> GetCommandLogByTurbineId(string turbineId, string commandLogId);
}