using Contracts.Models.AlertDTO;
using Dataaccess.Repository.Entities;

namespace Service.Mapper;

public class AlertMapper
{
    public AlertDTO ToDto(Alert alert)
    {
        return new AlertDTO
        {
            turbineId = alert.turbineId,
            timestamp = alert.timestamp,
            severity = alert.severity,
            message = alert.message
        };
    }

    public Alert ToEntity(AlertDTO alert)
    {
        return new Alert
        {
            turbineId = alert.turbineId,
            timestamp = alert.timestamp,
            severity = alert.severity,
            message = alert.message
        };
    }
}