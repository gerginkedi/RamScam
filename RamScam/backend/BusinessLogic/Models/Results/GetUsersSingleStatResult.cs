using RamScam.backend.DAL.Entities;
using static RamScam.backend.BusinessLogic.Models.DTOs.GameResultDTO;

namespace RamScam.backend.BusinessLogic.Models.Results
{
    public class GetUsersSingleStatResult : BaseResult
    {
        public UserStats Stat { get; set; }
    }
}
