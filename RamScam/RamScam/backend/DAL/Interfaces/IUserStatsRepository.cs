using RamScam.backend.DAL.Entities;
using System.Numerics;

namespace RamScam.backend.DAL.Interfaces
{
    public interface IUserStatsRepository : IGenericRepository<UserStats>
    {
        public Task<UserStats?> FindPlayedGameAsync(int userId, int gameId);   
    }
}
