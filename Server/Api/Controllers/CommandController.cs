using Mqtt.Controllers;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class CommandController(IMqttClientService mqtt) : ControllerBase
{
    [HttpPost("farm/{farmId}/windmill/{turbineId}/command")]
    public async Task SendCommand(string farmId, string turbineId, [FromBody] JsonElement command)
    {
        await mqtt.PublishAsync($"farm/{farmId}/windmill/{turbineId}/command", command.GetRawText());
    }
    
    // For testing purposes
    [HttpPost("farm/{farmId}/windmill/{turbineId}/alert")]
    public async Task SendAlert(string farmId, string turbineId, [FromBody] JsonElement alert)
    {
        await mqtt.PublishAsync($"farm/{farmId}/windmill/{turbineId}/alert", alert.GetRawText());
    }
}