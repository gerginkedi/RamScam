using Microsoft.EntityFrameworkCore;
using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;
using RamScam.backend.BusinessLogic.Models.Records;
using RamScam.backend.BusinessLogic.Models.Results;
using RamScam.backend.BusinessLogic.Services;
using RamScam.backend.DAL;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Entities;
using RamScam.backend.DAL.Interfaces;
using System.Reflection.Metadata.Ecma335;

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

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowVite", policy =>
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
            });


            #region DI kayitlari
            builder.Services.AddControllers();
            builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
            builder.Services.AddScoped<IGamesRepository, GamesRepository>();
            builder.Services.AddScoped<IGlobalStatsRepository, GlobalStatsRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserStatsRepository, UserStatsRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IGameStatsService, GameStatsService>();
            builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            #endregion


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();


            app.UseCors("AllowVite");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();

            app.MapGet("/api/test", () => new { message = "Bağlantı başarılı!" });

            app.Run();
        }
    }
}
