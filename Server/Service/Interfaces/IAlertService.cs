using Contracts.Models.AlertDTO;

namespace Service.Interfaces;

public interface IAlertService
{
    Task<AlertDTO> CreateAlertAsync(AlertDTO alert);
}