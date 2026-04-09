using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.BusinessLogic.Services
{
    public class GameStatsService : IGameStatsService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGlobalStatsRepository _globalStatsRepository;
        private readonly IGamesRepository _gamesRepository;

        public GameStatsService(IUserRepository userRepository, IGlobalStatsRepository globalStatsRepository, IGamesRepository gamesRepository)
        {
            _userRepository = userRepository;
            _globalStatsRepository = globalStatsRepository;
            _gamesRepository = gamesRepository;
        }

        public async Task<GameStatsResult> SaveGameResultAsync(GameResultDTO gameResult, int userId)
        {

            //TODO : ayarla burayi, kullanci oyun oynadiginda hem global hem de kendi stati guncellencek.
            User userWhoPlays = await _userRepository.GetByIdAsync(userId);
            Games playedGame = await _gamesRepository.GetByIdAsync(gameResult.GameId);

            #region global stats update

            return new GameStatsResult()
            {
                IsSuccessed = true
            };


            #endregion

        }
    }
}
