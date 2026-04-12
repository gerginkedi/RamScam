using Microsoft.EntityFrameworkCore;
using RamScam.backend.DAL;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Interfaces;
using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Services;
using RamScam.backend.BusinessLogic.Models.DTOs;
using System.Reflection.Metadata.Ecma335;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.BusinessLogic.Models.Records;

namespace RamScam.backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
            {   
                options.UseSqlServer(connectionString, sqlOptions => sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 10,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null));

            });

            // Add services to the container.
            #region DI kayitlari
            builder.Services.AddControllers();
            builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
            builder.Services.AddScoped<IGamesRepository, GamesRepository>();
            builder.Services.AddScoped<IGlobalStatsRepository, GlobalStatsRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserStatsRepository, UserStatsRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IGameStatsService, GameStatsService>();
            #endregion


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();


            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();

            app.MapGet("/api/test", () =>
            {
                return Results.Ok("Api çalışıyor");
            });

            app.MapGet("/api", () =>
            {
                // Home için genel bilgiler dönebilirsin
                return Results.Ok("Hoş geldiniz");
            });



            app.MapPost("/api/register", async (RegisterRequest request, IUserService userService) =>
            {
                RegisterResult result = await userService.RegisterAsync(request.Email, request.RawPassword);
                if(result.IsSuccessed == true)  
                    return Results.Ok(result);

                return Results.BadRequest(result);

            });

            app.MapPost("/api/login", async (LoginRequest request, IUserService userService) =>
            {
                // LoginAsync metodu email ve password bekliyor
                LoginResult result = await userService.LoginAsync(request.Email, request.RawPassword);

                if (result.IsSuccessed == true)
                    return Results.Ok(result);

                return Results.BadRequest(result);
            });

            // React'ten gelen oyun skoru sonucunu alır ve GameStatsService aracılığıyla veritabanına kaydeder.
            app.MapPost("/api/games/save-result", async (GameResultDTO resultData, IGameStatsService gameStatsService) =>
            {
                // Arkadaşının yazdığı servise React'ten gelen veriyi teslim ediyoruz
                GameStatsResult result = await gameStatsService.SaveGameResultAsync(resultData);

                if (result.IsSuccessed)
                    return Results.Ok(result);

                return Results.BadRequest(result);
            });

            // İstenilen bir oyunun (gameId) dünya çapındaki toplam oynanma, kazanılma gibi istatistiklerini getirir.
            app.MapGet("/api/stats/global/{gameId}", async (int gameId, IGlobalStatsRepository globalStatsRepo) =>
            {
                var stats = await globalStatsRepo.GetByGameIdAsync(gameId);

                if (stats == null)
                    return Results.NotFound(new { message = "Bu oyun için istatistik bulunamadı." });

                return Results.Ok(stats);
            });

            // Specific bir kullanıcının (userId) daha önce oynadığı tüm oyunların maç sonuçlarını getirir.
            app.MapGet("/api/users/{userId}/stats", async (int userId, IUserStatsRepository userStatsRepo) =>
            {
                // Veritabanındaki tüm kullanıcı istatistiklerini tablodan okumak için çağırıyoruz
                var allStats = await userStatsRepo.GetAllUntrackedAsync();

                // Ardından sadece o kullanıcıya ait olanları filtreleyip listeye çeviriyoruz.
                var userStats = await allStats.Where(stat => stat.UserId == userId).ToListAsync();

                return Results.Ok(userStats);
            });

            // Anakranda veya menüde oyunların isimlerini listelemek için tüm oyunları React'e gönderir.
            app.MapGet("/api/games", async (IGamesRepository gamesRepo) =>
            {
                // Veritabanındaki sistemdeki tüm oyunları çekiyoruz
                var allGames = await gamesRepo.GetAllUntrackedAsync();
                var gamesList = await allGames.ToListAsync();

                return Results.Ok(gamesList);
            });

            app.Run();
        }
    }
}
