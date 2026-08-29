using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamScam.Migrations
{
    /// <inheritdoc />
    public partial class AddArtifacts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SelectedArtifactId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Artifacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EffectType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EffectValue = table.Column<double>(type: "float", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artifacts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_SelectedArtifactId",
                table: "Users",
                column: "SelectedArtifactId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Artifacts_SelectedArtifactId",
                table: "Users",
                column: "SelectedArtifactId",
                principalTable: "Artifacts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Artifacts_SelectedArtifactId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Artifacts");

            migrationBuilder.DropIndex(
                name: "IX_Users_SelectedArtifactId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SelectedArtifactId",
                table: "Users");
        }
    }
}
