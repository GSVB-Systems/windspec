using Mqtt.Controllers;

namespace Api.Controllers;

public class TurbineController(ILogger<TurbineController> logger) : MqttController
{
    [MqttRoute("farm/{farmId}/windmill/{turbineId}/telemetry")]
        public async Task HandleTelemetry(string farmId, string turbineId, Telemetry telemetry)
        {
            logger.LogInformation("Telemetry for {TurbineId} in farm {FarmId}: {@Telemetry}", turbineId, farmId, telemetry);
            
        }
        
    public record Telemetry(
        string turbineId,
        string turbineName,
        string farmId,
        DateTime timestamp,
        double windSpeed,
        double windDirection,
        double ambientTemperature,
        double rotorSpeed,
        double powerOutput,
        double nacelleDirection,
        double bladePitch,
        double generatorTemp,
        double gearboxTemp,
        double vibration,
        string status
    );
    
    
    [MqttRoute("farm/{farmId}/windmill/{turbineId}/alert")]
    public async Task HandleAlert(string farmId, string turbineId, Alert alert)
    {
        logger.LogInformation("Telemetry for {TurbineId} in farm {FarmId}", turbineId, alert);
            
    }
    
    public record Alert(
        string turbineId,
        string farmId,
        DateTime timestamp,
        string severity,
        string message
    );
}