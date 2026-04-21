using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
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
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:5173/") // React uygulamanin adresi
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Add services to the container.
            #region DI kayitlari
            builder.Services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
            builder.Services.AddScoped<IGamesRepository, GamesRepository>();
            builder.Services.AddScoped<IGlobalStatsRepository, GlobalStatsRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserStatsRepository, UserStatsRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IGameStatsService, GameStatsService>();
            builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            builder.Services.AddAuthorization();

            builder.Services.AddAuthentication("Bearer")
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });
            #endregion


            var app = builder.Build();

            app.UseCors("AllowVite");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("AllowFrontend");

            app.MapGet("/api/test", () => new { message = "Bağlantı başarılı!" });
            app.MapPost("/api/login", async ([FromBody] RequestDTOs.LoginRequestDTO loginDto, IUserService userService) =>
            {
                LoginResult result = await userService.LoginAsync(loginDto.Email, loginDto.Password);
                
                if (result.IsSuccessed)
                    return Results.Ok(result);
                
                return Results.BadRequest(result);
            });
            app.MapPost("/api/register", async ([FromBody] RequestDTOs.RegisterRequestDTO registerDto, IUserService userService) =>
            {
                RegisterResult result = await userService.RegisterAsync(registerDto.Email, registerDto.Password);
                if(result.IsSuccessed)
                    return Results.Ok(result);

                return Results.BadRequest(result);

            });
            app.Run();
            
        }
    }

}
