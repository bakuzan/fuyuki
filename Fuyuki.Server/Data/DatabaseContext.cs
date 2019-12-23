using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Fuyuki.Data
{
    public class DatabaseContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DatabaseContext(DbContextOptions options,
                               IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<Group> Groups { get; set; }
        public DbSet<Subreddit> Subreddits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Group>()
                        .HasOne(x => x.ApplicationUser)
                        .WithMany(x => x.Groups)
                        .HasForeignKey(x => x.ApplicationUserId);

            modelBuilder.Entity<GroupSubreddit>()
                        .HasKey(x => new { x.GroupId, x.SubredditId });

            modelBuilder.Entity<GroupSubreddit>()
                        .HasOne(x => x.Group)
                        .WithMany(x => x.GroupSubreddits)
                        .HasForeignKey(x => x.GroupId);

            modelBuilder.Entity<GroupSubreddit>()
                        .HasOne(x => x.Subreddit)
                        .WithMany(x => x.GroupSubreddits)
                        .HasForeignKey(x => x.SubredditId);
        }

    }
}