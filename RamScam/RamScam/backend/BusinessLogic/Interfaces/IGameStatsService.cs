using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;

namespace RamScam.backend.BusinessLogic.Interfaces
{
    public interface IGameStatsService
    {
        public Task<GameStatsResult> SaveGameResultAsync(GameResultDTO gameResult, int userId);
    }
}
