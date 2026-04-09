using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamScam.Migrations
{
    /// <inheritdoc />
    public partial class added_TotalPlayCount_To_UserStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalPlayCount",
                table: "UserStats",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalPlayCount",
                table: "UserStats");
        }
    }
}
