using System.ComponentModel.DataAnnotations;

namespace Dataaccess.Repository.Entities;

public class Alerts
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid(); // Use GUID as primary key
    public string turbineId;
    public string farmId;
    public DateTime timestamp;
    public string severity;
    public string message;
}