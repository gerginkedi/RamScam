using RamScam.backend.DAL.Entities;
using System.Numerics;

namespace RamScam.backend.DAL.Interfaces
{
    public interface IUserStatsRepository : IGenericRepository<UserStats>
    {
        /// <summary>
        /// @brief returns the game which line has played to change.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="gameId"></param>
        /// <returns></returns>
        public Task<UserStats?> FindPlayedGameAsync(int userId, int gameId);
        /// <summary>
        /// @brief returns users all stat values
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IQueryable<UserStats> GetUsersStatsByUserId(int userId);
        /// <summary>
        /// @brief returns the user stats for a specific game
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="gameId"></param>
        /// <returns></returns>
        public Task<UserStats> GetSelectedUserStatByUserIdAndGameIdAsync(int userId, int gameId);
    }
}
