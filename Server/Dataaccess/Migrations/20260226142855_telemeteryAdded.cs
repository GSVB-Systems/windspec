using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dataaccess.Migrations
{
    /// <inheritdoc />
    public partial class telemeteryAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Telemetry",
                columns: table => new
                {
                    turbineId = table.Column<string>(type: "text", nullable: false),
                    turbineName = table.Column<string>(type: "text", nullable: false),
                    farmId = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    windSpeed = table.Column<double>(type: "double precision", nullable: false),
                    windDirection = table.Column<double>(type: "double precision", nullable: false),
                    ambientTemperature = table.Column<double>(type: "double precision", nullable: false),
                    rotorSpeed = table.Column<double>(type: "double precision", nullable: false),
                    powerOutput = table.Column<double>(type: "double precision", nullable: false),
                    nacelleDirection = table.Column<double>(type: "double precision", nullable: false),
                    bladePitch = table.Column<double>(type: "double precision", nullable: false),
                    generatorTemp = table.Column<double>(type: "double precision", nullable: false),
                    gearboxTemp = table.Column<double>(type: "double precision", nullable: false),
                    vibration = table.Column<double>(type: "double precision", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Telemetry", x => x.turbineId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Telemetry");
        }
    }
}
