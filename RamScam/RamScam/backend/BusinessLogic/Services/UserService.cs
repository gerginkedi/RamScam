using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static RamScam.backend.DAL.Entities.GameTypes;

namespace RamScam.backend.BusinessLogic.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserStatsRepository _userStatsRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public UserService(IUserRepository userRepository, IUserStatsRepository userStatsRepository, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _userStatsRepository = userStatsRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<RegisterResult> RegisterAsync(string email, string password)
        {
            User userToRegister = new User()
            {
                EMail = email,
                HashedPassword = await _passwordHasher.HashAsync(password)
            };
            User? isUsersEmailExist = await _userRepository.GetByEmailAsync(email);

            if (isUsersEmailExist != null)
                return new RegisterResult()
                {
                    IsSuccessed = false,
                    Message = "This email is already registered."
                };



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
                IsSuccessed = true,
                Message = "Registration successful."
            };


        }
        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return new LoginResult() { IsSuccessed = false, Message = "Email and password required." };

            User? loggingInUser = await _userRepository.GetByEmailAsync(email);


            if (loggingInUser != null)
            {
                if (await _passwordHasher.VerifyAsync(password, loggingInUser.HashedPassword))
                    return new LoginResult()
                    {
                        IsSuccessed = true,
                        Message = "Login successful.",
                        UserId = loggingInUser.Id,
                        Token = _jwtTokenGenerator.Generate(loggingInUser.Id, loggingInUser.EMail)
                    };

                else
                    return new LoginResult()
                    {
                        IsSuccessed = false,
                        Message = "Invalid email or password.",
                    };

            }
            else
                return new LoginResult()
                {
                    IsSuccessed = false,
                    Message = "Invalid email or password.",
                };
        }
    }
}
