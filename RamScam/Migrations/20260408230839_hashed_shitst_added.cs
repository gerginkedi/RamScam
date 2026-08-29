using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RamScam.Migrations
{
    /// <inheritdoc />
    public partial class hashed_shitst_added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordCodded",
                table: "Users",
                newName: "HashedPassword");

            migrationBuilder.RenameColumn(
                name: "EMailCodded",
                table: "Users",
                newName: "EMail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HashedPassword",
                table: "Users",
                newName: "PasswordCodded");

            migrationBuilder.RenameColumn(
                name: "EMail",
                table: "Users",
                newName: "EMailCodded");
        }
    }
}
