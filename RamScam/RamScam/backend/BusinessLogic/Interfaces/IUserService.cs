using RamScam.backend.BusinessLogic.Models.DTOs;

namespace RamScam.backend.BusinessLogic.Interfaces
{
    public interface IUserService
    {
        public Task RegisterAsync(RegisterDTO registerDTO);

    }
}
