using System.ComponentModel;
namespace RamScam.backend.DAL.Entities

{
    public class UserStats : BaseEntity
    {
        //foreign key relation to User table
        public virtual User User { get; set; }
        public int UserId { get; set; }

        //personal stats for each game
        public virtual Games Game{ get; set; }
        public int GameId { get; set; }
        public int WinCount { get; set; }
        public int LoseCount{ get; set; }
        public int DrawCount { get; set; }
        public int TotalPlayCount { get; set; } 
    }
}
