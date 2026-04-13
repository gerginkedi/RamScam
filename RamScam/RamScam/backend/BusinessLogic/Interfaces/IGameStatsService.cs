using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Entities;

namespace RamScam.backend.BusinessLogic.Interfaces
{
    public interface IGameStatsService
    {
        /// <summary>
        /// @brief saves game reuslts both public and private
        /// </summary>
        /// <param name="gameResult"></param>
        /// <returns></returns>
        public Task<GameStatsResult> SaveGameResultAsync(GameResultDTO gameResult);

        /// <summary>
        /// @brief returns user stats by user id as a list
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<GetAllUserStatsResult> GetUserStatsByUserId(int userId);
        /// <summary>
        /// @brief returns stat which specified by user id and game id
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="gameId"></param>
        /// <returns></returns>
        public Task<GetUsersSingleStatResult> GetUsersSingleStat(int userId, int gameId);
    }
}
