using RamScam.backend.DAL.Entities;

namespace RamScam.backend.BusinessLogic.Models.Results
{
    public class GetAllUserStatsResult : BaseResult
    {
        public List<UserStats> UserStats { get; set; }
    }
}
