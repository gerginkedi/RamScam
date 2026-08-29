using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace RamScam.backend.DAL.Concrete
{
    public class UserStatsRepository : GenericRepository<UserStats>, IUserStatsRepository
    {
        private readonly AppDbContext _context;
        public UserStatsRepository(AppDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<UserStats?> FindPlayedGameAsync(int userId, int gameId)
        {
            return await _context.UserStats
         .Where(u => u.UserId == userId && u.GameId == gameId)
         .FirstOrDefaultAsync();
        }

        public async Task<UserStats> GetSelectedUserStatByUserIdAndGameIdAsync(int userId, int gameId)
        {
            return await _context.UserStats.Where(us => us.UserId == userId && us.GameId == gameId).FirstOrDefaultAsync();
        }

        public  IQueryable<UserStats> GetUsersStatsByUserId(int userId)
        {
            return _context.UserStats.Where(us => us.UserId == userId);
        }
    }
}
