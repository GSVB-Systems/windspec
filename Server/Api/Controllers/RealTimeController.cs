using Dataaccess;
using Dataaccess.Repository.Entities;
using Microsoft.AspNetCore.Mvc;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;
using StateleSSE.AspNetCore.GroupRealtime;

namespace Api.Controllers;

public class RealTimeController(ISseBackplane backplane,AppDbContext db, IRealtimeManager realtimeManager) : RealtimeControllerBase(backplane)
{
    
    [HttpGet(nameof(GetTelemetry))]
    public async Task<RealtimeListenResponse<List<Telemetry>>> GetTelemetry(string connectionId)
    {
        var group = "telemetry";
        await backplane.Groups.AddToGroupAsync(connectionId, group);
        realtimeManager.Subscribe<AppDbContext>(connectionId, group, 
            criteria: snapshot =>
            {
                return snapshot.HasChanges<TurbineController.Telemetry>();
            },
            query: async context =>
            {
                return context.Telemetry.ToList();
            }
            );
        return new RealtimeListenResponse<List<Telemetry>>(group, db.Telemetry.ToList());
    }
}