using Microsoft.EntityFrameworkCore;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Concrete
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext dbContext) : base(dbContext)
        {
            _context = dbContext;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            try
            {
                User? user = await _context.Users.FirstOrDefaultAsync(u => u.EMail == email);
                if (user != null)
                    return user;

                else
                    throw new Exception("User not found");
            }

            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            
        }
    }
}
