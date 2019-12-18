using Microsoft.EntityFrameworkCore;

namespace Fuyuki.Data
{
    public class DatabaseContext : DbContext
    {
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Group> Groups { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // TODO
            // Make this customisable
            // Make this switchable based on env
            optionsBuilder.UseSqlite("Filename=../fuyuki.development.db");
        }
    }
}