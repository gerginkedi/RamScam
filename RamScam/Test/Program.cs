using Microsoft.EntityFrameworkCore;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.BusinessLogic.Services;
using RamScam.backend.DAL;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Interfaces;
using static RamScam.backend.BusinessLogic.Models.DTOs.GameResultDTO;


var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
string connectionString = "server = (localdb)\\MSSQLLocalDB; Database=gambling";
optionsBuilder.UseSqlServer(connectionString);


AppDbContext dbContext = new AppDbContext(optionsBuilder.Options);
UserRepository userRepository = new UserRepository(dbContext);
IPasswordHasher passwordHasher = new BcryptPasswordHasher();
UserStatsRepository userStatsRepository = new UserStatsRepository(dbContext);
UserService userService = new UserService(userRepository, userStatsRepository, passwordHasher);
GlobalStatsRepository globalStatsRepository = new GlobalStatsRepository(dbContext);
GamesRepository gamesRepository = new GamesRepository(dbContext);
GameStatsService gameStatsService = new GameStatsService(userRepository, globalStatsRepository, gamesRepository, userStatsRepository);

GameResultDTO gameResultDTO = new GameResultDTO
{
    GameSummary = GameResult.Win,
    GameId = 1,
    UserId = 9

};


GameStatsResult asd =await gameStatsService.SaveGameResultAsync(gameResultDTO);

Console.WriteLine(asd.GamesResult);
Console.WriteLine(asd.IsSuccessed);
Console.WriteLine(asd.Message);
