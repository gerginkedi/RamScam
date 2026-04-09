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
UserService userService = new UserService(userRepository, passwordHasher);

RegisterDTO registerDTO = new RegisterDTO()
{
    Email = "qwe@gmail.com",
    RawPassword = "123456"
};

await userService.RegisterAsync(registerDTO);
await userService.RegisterAsync(registerDTO);

