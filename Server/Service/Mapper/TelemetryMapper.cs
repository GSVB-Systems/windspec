using Contracts.Models.TelemetryDTO;
using Dataaccess.Repository.Entities;

namespace Service.Mapper;

public class TelemetryMapper
{
    public static TelemetryDTO ToDto(Telemetry telemetry)
    {
        return new TelemetryDTO
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

    }

    public object ToEntity(TelemetryDTO telemetry)
    {
        return new Telemetry
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
    }
}