using Mqtt.Controllers;
using System.Text.Json;
using Bogus;
using Contracts.Models.CommandLogDTO;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using Service.Services;

namespace Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class CommandController(IMqttClientService mqtt, ICommandLogService commandLogService) : ControllerBase
{

    private readonly ICommandLogService _commandLogService = commandLogService;

    [HttpPost("farm/{farmId}/windmill/{turbineId}/command")]
    public async Task SendCommand(string farmId, string turbineId, [FromBody] JsonElement command)
    {
        await _commandLogService.CreateCommandLogAsync(new CommandLogDTO()
        {
            farmId = farmId,
            turbineId = turbineId,
            action = command.GetProperty("action").GetString(),
            timestamp = DateTime.UtcNow,
            angle = command.TryGetProperty("angle", out var angleProp) ? angleProp.GetDouble() : null,
            value = command.TryGetProperty("value", out var valueProp) ? valueProp.GetInt32() : null,
            reason = command.TryGetProperty("reason", out var reasonProp) ? reasonProp.GetString() : null,
        });

        
        await mqtt.PublishAsync($"farm/{farmId}/windmill/{turbineId}/command", command.GetRawText());
    }
    
    // For testing purposes
    [HttpPost("farm/{farmId}/windmill/{turbineId}/alert")]
    public async Task SendAlert(string farmId, string turbineId, [FromBody] JsonElement alert)
    {
        await mqtt.PublishAsync($"farm/{farmId}/windmill/{turbineId}/alert", alert.GetRawText());
    }
}