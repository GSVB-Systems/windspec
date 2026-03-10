using Contracts.Models.CommandLogDTO;

namespace service.Exceptions;

public static class CommandLogValidator
{
    public static void ValidateCreate(CommandLogDTO commandLog)
    {
        if (commandLog is null)
            throw new InvalidRequestException("Command log cannot be null.");

        if (string.IsNullOrWhiteSpace(commandLog.turbineId))
            throw new InvalidRequestException("TurbineId is required.");

        if (string.IsNullOrWhiteSpace(commandLog.farmId))
            throw new InvalidRequestException("FarmId is required.");

        if (string.IsNullOrWhiteSpace(commandLog.action))
            throw new InvalidRequestException("Action is required.");

        if (commandLog.timestamp == default)
            throw new InvalidRequestException("Timestamp is required.");

        if (commandLog.timestamp > DateTime.UtcNow)
            throw new InvalidRequestException("Timestamp cannot be in the future.");

        if (commandLog.angle.HasValue && (commandLog.angle < 0 || commandLog.angle > 360))
            throw new RangeValidationException("Angle must be between 0 and 360 degrees.");

        if (commandLog.value.HasValue && commandLog.value < 0)
            throw new RangeValidationException("Value must be a non-negative number.");
        
        if (commandLog.action == null && commandLog.value == 0)
            throw new InvalidRequestException("Action is required.");
        
        if (commandLog.action != null && commandLog.value.HasValue && commandLog.value == 0)
            throw new InvalidRequestException("Value cannot be zero when action is provided.");

        if (commandLog.action == "setPitch" && (!commandLog.angle.HasValue || commandLog.angle < 0 || commandLog.angle > 30))
            throw new InvalidRequestException("Angle must be provided and value must be between 0 and 30 when action is 'setPitch'.");
        
        if (commandLog.action == "setInterval" && (!commandLog.value.HasValue || commandLog.value <= 0 || commandLog.value > 60))
            throw new InvalidRequestException("Value must be provided and greater than 0 when action is 'setInterval'.");
    }

    public static void ValidateFarmId(string farmId)
    {
        if (string.IsNullOrWhiteSpace(farmId))
            throw new InvalidRequestException("FarmId is required.");
    }

    public static void ValidateTurbineId(string turbineId)
    {
        if (string.IsNullOrWhiteSpace(turbineId))
            throw new InvalidRequestException("TurbineId is required.");
    }

    public static void ValidateCommandLogResult<T>(IEnumerable<T> result, string context)
    {
        if (!result.Any())
            throw new ResourceNotFoundException($"No command logs found for {context}.");
    }
}


