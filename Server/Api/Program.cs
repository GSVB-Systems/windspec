using Api;
using Api.Extension;
using Mqtt.Controllers;


var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

var mqtt = app.Services.GetRequiredService<IMqttClientService>();
await mqtt.ConnectAsync("broker.hivemq.com", 1883);

//app.GenerateApiClientsFromOpenApi("/../../client/src/models/ServerAPI.ts").GetAwaiter().GetResult();

app.UseCors(config => config
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
    .SetIsOriginAllowed(_ => true)
);

app.UseHttpsRedirection();

app.UseCors(_=>_.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(_=> true));
app.UseOpenApi();
app.UseSwaggerUi();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
