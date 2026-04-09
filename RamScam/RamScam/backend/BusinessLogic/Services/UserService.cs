using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
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

        public async Task<RegisterResult> RegisterAsync(RegisterDTO registerDTO)
        {
            User userToRegister = new User()
            {
                EMail = registerDTO.Email,
                HashedPassword = await _passwordHasher.HashAsync(registerDTO.RawPassword)
            };
            User isUsersEmailExist = await _userRepository.GetByEmailAsync(registerDTO.Email);
            if (isUsersEmailExist != null)
            {
                return new RegisterResult()
                {
                    IsSuccessed = false,
                    Message = "This email is already registered."
                };
            }


            try
            {
                await _userRepository.CreateAsync(userToRegister);
                return new RegisterResult()
                {
                    IsSuccessed = true
                };
            }
            catch (Exception e)
            {
                return new RegisterResult()
                {
                    IsSuccessed = false,
                    Message = e.Message
                };
            }


        }
        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            try
            {
                User? loggingInUser = await _userRepository.GetByEmailAsync(email);
                bool isPassTrue = await _passwordHasher.VerifyAsync(password, loggingInUser.HashedPassword);
                if (isPassTrue && loggingInUser != null)
                {
                    return new LoginResult()
                    {
                        IsSuccessed = true,
                        UserId = loggingInUser.Id
                    };
                }
                else
                {
                    return new LoginResult()
                    {
                        IsSuccessed = false,
                        Message = "Invalid email or password.",
                    };
                }
            }
            catch (Exception e)
            {
                return new LoginResult()
                {
                    IsSuccessed = false,
                    Message = e.Message
                };
            }
        }
    }
}
