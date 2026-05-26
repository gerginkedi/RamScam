using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace RamScam.backend.DAL.Concrete
{
    public class GlobalStatsRepository : GenericRepository<GlobalStats>, IGlobalStatsRepository
    {
        AppDbContext _context;
        public GlobalStatsRepository(AppDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<GlobalStats?> GetByGameIdAsync(int gameId)
        {
            return await _context.GlobalStats.FirstOrDefaultAsync(gs => gs.GameId == gameId);
        }
    }
}
