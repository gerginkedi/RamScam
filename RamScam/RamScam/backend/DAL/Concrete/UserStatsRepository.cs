using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Concrete
{
    public class UserStatsRepository : GenericRepository<UserStats>, IUserStatsRepository
    {
        public UserStatsRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}
