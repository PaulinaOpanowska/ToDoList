using Microsoft.EntityFrameworkCore;
using ToDoBackend.Core.Models;

namespace ToDoBackend.Repositories
{
    public class ToDoDbContext : DbContext
    {
        public DbSet<ToDo> ToDos { get; set; }
        public DbSet<Priority> Priorities { get; set; }

        public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
          : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}