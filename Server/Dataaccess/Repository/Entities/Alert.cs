using System.ComponentModel.DataAnnotations;

namespace Dataaccess.Repository.Entities;

public class Alert
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid(); // Use GUID as primary key
    public string turbineId { get; set; } = string.Empty;
    public string farmId {get; set;} = string.Empty;
    public DateTime timestamp { get; set; } = DateTime.UtcNow;
    public string severity { get; set; } = string.Empty;
    public string message {get; set;} = string.Empty;
}