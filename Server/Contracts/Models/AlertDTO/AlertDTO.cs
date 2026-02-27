namespace Contracts.Models.AlertDTO;

public class AlertDTO
{
    public string turbineId { get; set; } = string.Empty;
    public string farmId { get; set; } = string.Empty;
    public DateTime timestamp { get; set; } = DateTime.UtcNow;
    public string severity { get; set; } = string.Empty;
    public string message { get; set; } = string.Empty;
}