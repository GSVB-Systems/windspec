using Mqtt.Controllers;
using Service.Interfaces;
using Service.Services;
using StateleSSE.AspNetCore;

namespace Api.Controllers;

public class TurbineController(ILogger<TurbineController> logger, ITelemetryService telemetryService, IAlertService alertService, ISseBackplane backplane) : MqttController
{
    
    private readonly ITelemetryService _telemetryService = telemetryService;
    private readonly IAlertService _alertService = alertService;
    
    
    [MqttRoute("farm/GSVB2/windmill/{turbineId}/telemetry")]
        public async Task HandleTelemetry(string farmId, string turbineId, Telemetry telemetry)
        {
            //logger.LogInformation("Telemetry for {TurbineId} in farm {FarmId}: {@Telemetry}", turbineId, farmId, telemetry);

            var telemetryDTO = new Contracts.Models.TelemetryDTO.TelemetryDTO
            {
                turbineId = telemetry.turbineId,
                turbineName = telemetry.turbineName,
                farmId = telemetry.farmId,
                timestamp = telemetry.timestamp,
                windSpeed = telemetry.windSpeed,
                windDirection = telemetry.windDirection,
                ambientTemperature = telemetry.ambientTemperature,
                rotorSpeed = telemetry.rotorSpeed,
                powerOutput = telemetry.powerOutput,
                nacelleDirection = telemetry.nacelleDirection,
                bladePitch = telemetry.bladePitch,
                generatorTemp = telemetry.generatorTemp,
                gearboxTemp = telemetry.gearboxTemp,
                vibration = telemetry.vibration,
                status = telemetry.status
            };

            var group = "telemetry";

            await _telemetryService.CreateTelemetryAsync(telemetryDTO);
            await backplane.Clients.SendToGroupAsync(group, telemetryDTO);

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
    
    [MqttRoute("farm/GSVB2/windmill/{turbineId}/alert")]
        public async Task HandleAlert(string farmId, string turbineId, Alert alert)
        {
            logger.LogInformation("Alerts for {TurbineId} in farm {FarmId}", turbineId, alert);
             
            var alertDTO = new Contracts.Models.AlertDTO.AlertDTO
            {
                turbineId = alert.turbineId,
                farmId = alert.farmId,
                timestamp = alert.timestamp,
                severity = alert.severity,
                message = alert.message
            };
            
            var group = "alerts";
            
            await _alertService.CreateAlertAsync(alertDTO);
            await backplane.Clients.SendToGroupAsync(group, alertDTO);
            
        }
    
    
    public record Alert(
        string turbineId,
        string farmId,
        DateTime timestamp,
        string severity,
        string message
    );
}