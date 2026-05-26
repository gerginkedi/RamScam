using RamScam.backend.DAL.Entities;

namespace RamScam.backend.DAL.Interfaces
{
    public interface IGlobalStatsRepository : IGenericRepository<GlobalStats>
    {
        public Task<GlobalStats?> GetByGameIdAsync(int gameId);
    }
}
