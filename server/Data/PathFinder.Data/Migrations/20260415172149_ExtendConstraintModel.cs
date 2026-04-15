using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PathFinder.Data.Migrations
{
    /// <inheritdoc />
    public partial class ExtendConstraintModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConstraintType",
                table: "ShipmentConstraints",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Value",
                table: "ShipmentConstraints",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConstraintType",
                table: "ShipmentConstraints");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "ShipmentConstraints");
        }
    }
}
