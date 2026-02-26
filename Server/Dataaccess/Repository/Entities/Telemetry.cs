namespace Dataaccess.Repository.Entities;

public class Telemetry
{
    public string turbineId { get; set; } = string.Empty;
    public string turbineName { get; set; } = string.Empty;
    public string farmId { get; set; } = string.Empty;
    public DateTime timestamp { get; set; } =  DateTime.UtcNow;
    public double windSpeed { get; set; }
    public double windDirection { get; set; }
    public double ambientTemperature { get; set; }
    public double rotorSpeed { get; set; }
    public double powerOutput { get; set; }
    public double nacelleDirection { get; set; }
    public double bladePitch  { get; set; }
    public double generatorTemp { get; set; }
    public double gearboxTemp { get; set; }
    public double vibration { get; set; }
    public string status { get; set; }
}