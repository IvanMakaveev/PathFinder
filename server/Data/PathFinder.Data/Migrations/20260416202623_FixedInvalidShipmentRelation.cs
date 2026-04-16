using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PathFinder.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixedInvalidShipmentRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ShipmentConstraints_ShipmentId",
                table: "ShipmentConstraints");

            migrationBuilder.CreateIndex(
                name: "IX_ShipmentConstraints_ShipmentId",
                table: "ShipmentConstraints",
                column: "ShipmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ShipmentConstraints_ShipmentId",
                table: "ShipmentConstraints");

            migrationBuilder.CreateIndex(
                name: "IX_ShipmentConstraints_ShipmentId",
                table: "ShipmentConstraints",
                column: "ShipmentId",
                unique: true);
        }
    }
}
