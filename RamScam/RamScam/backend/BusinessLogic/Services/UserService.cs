using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.BusinessLogic.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task RegisterAsync(RegisterDTO registerDTO)
        {
            User userToRegister = new User
            {
                EMail = registerDTO.Email,
                HashedPassword = _passwordHasher.Hash(registerDTO.RawPassword)

            };
            await _userRepository.CreateAsync(userToRegister);
        }
    }
}
