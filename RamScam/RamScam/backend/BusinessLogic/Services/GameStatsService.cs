using Microsoft.EntityFrameworkCore;
using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;
using static RamScam.backend.BusinessLogic.Models.DTOs.GameResultDTO;

namespace RamScam.backend.BusinessLogic.Services
{
    public class GameStatsService : IGameStatsService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGlobalStatsRepository _globalStatsRepository;
        private readonly IGamesRepository _gamesRepository;
        private readonly IUserStatsRepository _userStatsRepository;

        public GameStatsService(IUserRepository userRepository, IGlobalStatsRepository globalStatsRepository, IGamesRepository gamesRepository, IUserStatsRepository userStatsRepository)
        {
            _userRepository = userRepository;
            _globalStatsRepository = globalStatsRepository;
            _gamesRepository = gamesRepository;
            _userStatsRepository = userStatsRepository;
        }

        public async Task<GetUsersSingleStatResult> GetUsersSingleStat(int userId, int gameId)
        {
            GetUsersSingleStatResult dataToReturn = new GetUsersSingleStatResult();
            if (await _userRepository.GetByIdAsync(userId) == null && await _gamesRepository.GetByIdAsync(gameId) == null) {
                dataToReturn.Stat = null;
                dataToReturn.IsSuccessed = false;
                dataToReturn.Message = "User and Game not found.";
                return dataToReturn;
            }
            
            dataToReturn.Stat = await _userStatsRepository.GetSelectedUserStatByUserIdAndGameIdAsync(userId, gameId);
            dataToReturn.Message = "User stat retrieved successfully.";
            dataToReturn.IsSuccessed = true;
            return dataToReturn;
        }

        public async Task<GetAllUserStatsResult> GetUserStatsByUserId(int userId)
        {
            GetAllUserStatsResult dataToReturn = new GetAllUserStatsResult();
            if ( await _userRepository.GetByIdAsync_Untracked_(userId) == null)
            {
                dataToReturn.IsSuccessed = false;
                dataToReturn.Message = "User not found.";
                dataToReturn.UserStats = null;
                return dataToReturn;
            }

            dataToReturn.IsSuccessed = true;
            dataToReturn.Message = "User stats retrieved successfully.";
            dataToReturn.UserStats = _userStatsRepository.GetUsersStatsByUserId(userId).ToList();
            return dataToReturn;
        }

        public async Task<GameStatsResult> SaveGameResultAsync(GameResultDTO gameResult)
        {
            UserStats? personalStatsToChange = await _userStatsRepository.FindPlayedGameAsync(gameResult.UserId, gameResult.GameId);
            GlobalStats? globalStatsToChange = await _globalStatsRepository.GetByGameIdAsync(gameResult.GameId);

            if (personalStatsToChange == null)
                return new GameStatsResult
                {
                    IsSuccessed = false,
                    Message = "User stats not found for the played game.",
                    GamesResult = GameResult.Crashed
                };
            if (globalStatsToChange == null)
                return new GameStatsResult
                {
                    IsSuccessed = false,
                    Message = "Global stats not found for the played game.",
                    GamesResult = GameResult.Crashed
                };


            GameStatsResult result = new GameStatsResult();

            personalStatsToChange.TotalPlayCount++;
            globalStatsToChange.GlobalTotalPlayCount++;

            switch (gameResult.GameSummary)
            {
                case GameResult.Win:
                    globalStatsToChange.GlobalWinCount++;

                    personalStatsToChange.WinCount++;
                    result.GamesResult = GameResult.Win;

                    result.IsSuccessed = true;
                    result.Message = "Game result saved successfully.";

                    await _userStatsRepository.UpdateAsync(personalStatsToChange);
                    await _globalStatsRepository.UpdateAsync(globalStatsToChange);

                    return result;


                case GameResult.Lose:
                    globalStatsToChange.GlobalLoseCount++;
                    personalStatsToChange.LoseCount++;

                    result.GamesResult = GameResult.Lose;
                    result.IsSuccessed = true;
                    result.Message = "Game result saved successfully.";

                    await _userStatsRepository.UpdateAsync(personalStatsToChange);
                    await _globalStatsRepository.UpdateAsync(globalStatsToChange);

                    return result;


                case GameResult.Draw:
                    globalStatsToChange.GlobalDrawCount++;
                    personalStatsToChange.DrawCount++;

                    result.GamesResult = GameResult.Draw;
                    result.IsSuccessed = true;
                    result.Message = "Game result saved successfully.";

                    await _userStatsRepository.UpdateAsync(personalStatsToChange);
                    await _globalStatsRepository.UpdateAsync(globalStatsToChange);

                    return result;


                default:
                    result.GamesResult = GameResult.Crashed;
                    result.IsSuccessed = false;
                    result.Message = "Game results cannot saved.";
                    return result;
            }
        }
    }
}
