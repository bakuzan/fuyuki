using Microsoft.EntityFrameworkCore;

namespace Fuyuki.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Group> Groups { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=../fuyuki.development.db");
        }
    }
}