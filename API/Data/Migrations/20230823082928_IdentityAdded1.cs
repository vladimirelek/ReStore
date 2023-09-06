using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class IdentityAdded1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7096c960-b83d-42ea-9c5f-c9e40b3fdeb4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "de97d56b-0b82-40e6-8489-b0c5c5fb8330");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "ab5613df-3f02-41d2-abe6-c45eb2d913ef", null, "Member", "MEMBER" },
                    { "c1ea34ff-b7f9-4c84-a811-5f060d7b0c7a", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                    { "7096c960-b83d-42ea-9c5f-c9e40b3fdeb4", null, "Member", "MEMBER" },
                    { "de97d56b-0b82-40e6-8489-b0c5c5fb8330", null, "Admin", "ADMIN" }
                });
        }
    }
}
