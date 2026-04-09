using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Concrete
{
    public class GlobalStatsRepository : GenericRepository<GlobalStats>, IGlobalStatsRepository
    {
        public GlobalStatsRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}
