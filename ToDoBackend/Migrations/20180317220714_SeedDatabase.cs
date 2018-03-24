using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ToDoBackend.Migrations
{
    public partial class SeedDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Priorities (Name) VALUES ('High')");
            migrationBuilder.Sql("INSERT INTO Priorities (Name) VALUES ('Medium')");
            migrationBuilder.Sql("INSERT INTO Priorities (Name) VALUES ('Low')");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELATE FROM Priorities");
        }
    }
}
