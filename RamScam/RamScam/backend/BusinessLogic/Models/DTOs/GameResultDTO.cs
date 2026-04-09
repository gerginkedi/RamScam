namespace RamScam.backend.BusinessLogic.Models.DTOs
{
    public class GameResultDTO
    {
        public enum GameResult
        {
            Win = 1,
            Lose = 2,
            Draw = 3
        }

        public int GameId { get; set; }
        public GameResult GameSummary { get; set; }

    }
}

