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
        realtimeManager.Subscribe<AppDbContext>(connectionId, group, 
            criteria: snapshot => { return snapshot.HasChanges<Telemetry>(); },
            query: async context => { return context.Telemetry.OrderBy(t => t.timestamp).Last(); }
            );
        return new RealtimeListenResponse<List<Telemetry>>(group, db.Telemetry.ToList());
    }

    [HttpGet(nameof(GetAlert))]
    public async Task<RealtimeListenResponse<List<Alert>>> GetAlert(string connectionId)
    {
        var group = "alerts";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
        realtimeManager.Subscribe<AppDbContext>(connectionId, group,
            criteria: snapshot => { return snapshot.HasChanges<Alert>(); },
            query: async context => { return context.Alert.OrderBy(t => t.timestamp).Last(); }
        );
        return new RealtimeListenResponse<List<Alert>>(group, db.Alert.ToList());
    }
}