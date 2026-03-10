namespace Dataaccess.Repository.Entities;

public class CommandLog
{
    public Guid Id { get; set; } = Guid.NewGuid(); // Use GUID as primary key
    public string turbineId { get; set; }
    public string farmId { get; set; }
    public string action { get; set; }
    public string? reason { get; set; }
    public DateTime timestamp { get; set; }
    public double? angle { get; set; }
    public int? value { get; set; }
}