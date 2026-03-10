using Dataaccess;
using Dataaccess.Repository.Entities;
using Microsoft.AspNetCore.Mvc;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;
using StateleSSE.AspNetCore.GroupRealtime;

namespace Api.Controllers;

public class RealTimeController(ISseBackplane backplane,AppDbContext db, IRealtimeManager realtimeManager, IGroupRealtimeManager groupRealtimeManager) : RealtimeControllerBase(backplane)
{
    
    [HttpGet(nameof(GetTelemetry))]
    public async Task<RealtimeListenResponse<List<Telemetry>>> GetTelemetry(string connectionId)
    {
        var group = "telemetry";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
        return new RealtimeListenResponse<List<Telemetry>>(group, db.Telemetry.OrderByDescending(t => t.timestamp).Take(80640).ToList());
    }

    [HttpGet(nameof(GetAlert))]
    public async Task<RealtimeListenResponse<List<Alert>>> GetAlert(string connectionId)
    {
        var group = "alerts";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
        return new RealtimeListenResponse<List<Alert>>(group, db.Alert.OrderByDescending(t => t.timestamp).Take(80640).ToList());
    }
}