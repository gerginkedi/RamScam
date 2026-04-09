using Microsoft.EntityFrameworkCore;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Concrete
{
    public class GamesRepository : GenericRepository<Games>, IGamesRepository
    {
        public GamesRepository(AppDbContext dbContext) : base(dbContext)
        {
        }
    }
}
