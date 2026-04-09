using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Entities;

namespace RamScam.backend.BusinessLogic.Interfaces
{
    public interface IUserService
    {
        public Task<RegisterResult> RegisterAsync(RegisterDTO registerDTO);
        public Task<LoginResult> LoginAsync(string email, string password);

    }
}
