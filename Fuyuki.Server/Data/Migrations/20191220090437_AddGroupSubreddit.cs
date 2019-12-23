using Microsoft.EntityFrameworkCore.Migrations;

namespace Fuyuki.Data.Migrations
{
    public partial class AddGroupSubreddit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Subreddits",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subreddits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupSubreddit",
                columns: table => new
                {
                    GroupId = table.Column<int>(nullable: false),
                    SubredditId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupSubreddit", x => new { x.GroupId, x.SubredditId });
                    table.ForeignKey(
                        name: "FK_GroupSubreddit_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupSubreddit_Subreddits_SubredditId",
                        column: x => x.SubredditId,
                        principalTable: "Subreddits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupSubreddit_SubredditId",
                table: "GroupSubreddit",
                column: "SubredditId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupSubreddit");

            migrationBuilder.DropTable(
                name: "Subreddits");
        }
    }
}
