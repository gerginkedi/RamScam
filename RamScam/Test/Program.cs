using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.BusinessLogic.Services;
using RamScam.backend.DAL;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Interfaces;


var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
string connectionString = "server = (localdb)\\MSSQLLocalDB; Database=gambling";
optionsBuilder.UseSqlServer(connectionString);


AppDbContext dbContext = new AppDbContext(optionsBuilder.Options);
UserRepository userRepository = new UserRepository(dbContext);
IPasswordHasher passwordHasher = new BcryptPasswordHasher();
UserStatsRepository userStatsRepository = new UserStatsRepository(dbContext);
UserService userService = new UserService(userRepository, userStatsRepository, passwordHasher);



RegisterResult asd = await userService.RegisterAsync(new RegisterDTO()
{
    Email = "asfdgsa",
    RawPassword = "sde1231"

});



