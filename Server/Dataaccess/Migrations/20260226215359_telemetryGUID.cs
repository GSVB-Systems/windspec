using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dataaccess.Migrations
{
    /// <inheritdoc />
    public partial class telemetryGUID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Telemetry",
                table: "Telemetry");

            migrationBuilder.AddColumn<string>(
                name: "id",
                table: "Telemetry",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Telemetry",
                table: "Telemetry",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Telemetry",
                table: "Telemetry");

            migrationBuilder.DropColumn(
                name: "id",
                table: "Telemetry");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Telemetry",
                table: "Telemetry",
                column: "turbineId");
        }
    }
}
