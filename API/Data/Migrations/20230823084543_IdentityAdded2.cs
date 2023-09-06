using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class IdentityAdded2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ab5613df-3f02-41d2-abe6-c45eb2d913ef");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c1ea34ff-b7f9-4c84-a811-5f060d7b0c7a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "829332c8-026a-43a3-adca-10815594f0d7", null, "Admin", "ADMIN" },
                    { "bea78337-8ec1-4e5f-9679-838862ef766c", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "829332c8-026a-43a3-adca-10815594f0d7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bea78337-8ec1-4e5f-9679-838862ef766c");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "ab5613df-3f02-41d2-abe6-c45eb2d913ef", null, "Member", "MEMBER" },
                    { "c1ea34ff-b7f9-4c84-a811-5f060d7b0c7a", null, "Admin", "ADMIN" }
                });
        }
    }
}
