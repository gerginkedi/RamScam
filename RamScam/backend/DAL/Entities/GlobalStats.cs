namespace RamScam.backend.DAL.Entities
{
    public class GlobalStats : BaseEntity
    {
        //global stats for each game
        public virtual Games Game { get; set; }
        public int GameId { get; set; }
        public int GlobalWinCount { get; set; }
        public int GlobalLoseCount { get; set; }
        public int GlobalDrawCount { get; set; }
        public int GlobalTotalPlayCount { get; set; }
    }
}
