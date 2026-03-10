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
        ChangeSnapshot? telemetrySnapshot = null;
        realtimeManager.Subscribe<AppDbContext>(connectionId, group,
            criteria: snapshot => { telemetrySnapshot = snapshot; return snapshot.HasChanges<Telemetry>(); },
            query: async context => { return telemetrySnapshot!.OfType<Telemetry>().Last(); }
            );
        return new RealtimeListenResponse<List<Telemetry>>(group, db.Telemetry.OrderByDescending(t => t.timestamp).Take(80640).ToList());
    }

    [HttpGet(nameof(GetAlert))]
    public async Task<RealtimeListenResponse<List<Alert>>> GetAlert(string connectionId)
    {
        var group = "alerts";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
        ChangeSnapshot? alertSnapshot = null;
        realtimeManager.Subscribe<AppDbContext>(connectionId, group,
            criteria: snapshot => { alertSnapshot = snapshot; return snapshot.HasChanges<Alert>(); },
            query: async context => { return alertSnapshot!.OfType<Alert>().Last(); }
        );
        return new RealtimeListenResponse<List<Alert>>(group, db.Alert.OrderByDescending(t => t.timestamp).Take(80640).ToList());
    }
}