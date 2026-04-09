using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;
using static RamScam.backend.DAL.Entities.GameTypes;

namespace RamScam.backend.BusinessLogic.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserStatsRepository _userStatsRepository;
        private readonly IPasswordHasher _passwordHasher;
        public UserService(IUserRepository userRepository,IUserStatsRepository userStatsRepository ,IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _userStatsRepository = userStatsRepository;
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
                int gameCount = Enum.GetValues(typeof(GameType)).Length;

                for (int i = 1; i <= gameCount; i++)
                {
                    await _userStatsRepository.CreateAsync(new UserStats
                    {
                        User = userToRegister,
                        GameId = i,
                        WinCount = 0,
                        LoseCount = 0,
                        DrawCount = 0
                    });
                }

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
                    Message = "failed to register" + e.Message
                };
            }


        }
        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            try
            {
                User? loggingInUser = await _userRepository.GetByEmailAsync(email);

                if (loggingInUser != null)
                {
                    bool isPassTrue = await _passwordHasher.VerifyAsync(password, loggingInUser.HashedPassword);
                    if (isPassTrue)
                    {
                        return new LoginResult()
                        {
                            IsSuccessed = true,
                            Message = "Login successful.",
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
