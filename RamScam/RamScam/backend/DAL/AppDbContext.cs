using Microsoft.EntityFrameworkCore;
using RamScam.backend.DAL.Entities;

namespace RamScam.backend.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Games> Games { get; set; }
        public DbSet<GlobalStats> GlobalStats { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserStats> UserStats { get; set; }

    }
}
