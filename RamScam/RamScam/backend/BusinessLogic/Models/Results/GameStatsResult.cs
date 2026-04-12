using static RamScam.backend.BusinessLogic.Models.DTOs.GameResultDTO;

namespace RamScam.backend.BusinessLogic.Models.Results
{
    public class GameStatsResult : BaseResult
    {
        public GameResult GamesResult { get; set; }
    }
}
//this for keep the GameStatsResultServices return
