using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Entities;

namespace RamScam.backend.BusinessLogic.Interfaces
{
    public interface IUserService
    {
        public Task<RegisterResult> RegisterAsync(string email, string password);
        public Task<LoginResult> LoginAsync(string email, string password);
    }
}
