namespace Contracts.Models.CommandLogDTO;

public class CommandLogDTO
{
    required 
    public string turbineId { get; set; } 
    required 
    public string farmId { get; set; }
    required 
    public string action { get; set; }
    public string? reason { get; set; }
    public DateTime timestamp { get; set; }
    public double? angle { get; set; }
    public int? value { get; set; }
   
}