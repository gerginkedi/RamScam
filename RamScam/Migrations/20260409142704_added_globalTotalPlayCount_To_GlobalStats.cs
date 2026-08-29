using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamScam.Migrations
{
    /// <inheritdoc />
    public partial class added_globalTotalPlayCount_To_GlobalStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GlobalTotalPlayCount",
                table: "GlobalStats",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GlobalTotalPlayCount",
                table: "GlobalStats");
        }
    }
}
