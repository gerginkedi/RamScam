using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Entities;

namespace RamScam.backend.DAL.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
