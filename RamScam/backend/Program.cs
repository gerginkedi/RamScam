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
                options.AddPolicy("AllowVite", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
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
            builder.Services.AddHttpClient<IN8nService, N8nService>();

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

            app.UseCors("AllowVite"); // Sadece boş UseCors eklersek AddDefaultPolicy'yi algılar.
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

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


            // Frontend Fun Fact çekeceği endpoint
            app.MapGet("/funfact/get-fact", async (IN8nService n8nService) =>
            {
                string fact = await n8nService.GetFunFactAsync();
                return Results.Ok(new { fact = fact });
            });

            // Artifact endpoints
            app.MapGet("/api/artifacts/random", async (AppDbContext db) =>
            {
                var artifacts = await db.Artifacts.OrderBy(a => Guid.NewGuid()).Take(3).ToListAsync();
                return Results.Ok(artifacts);
            }).RequireAuthorization();

            app.MapPost("/api/artifacts/select", async (System.Security.Claims.ClaimsPrincipal user, [FromBody] int artifactId, AppDbContext db) =>
            {
                var userIdStr = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdStr == null) return Results.Unauthorized();
                var userId = int.Parse(userIdStr);

                // Mark old runs as inactive
                var activeRuns = await db.Runs.Where(r => r.UserId == userId && r.IsActive).ToListAsync();
                foreach (var r in activeRuns) r.IsActive = false;

                // Create new run
                var newRun = new Run
                {
                    UserId = userId,
                    ArtifactId = artifactId,
                    IsActive = true,
                    InitialRamMb = 512 // Default, can be updated later by another endpoint
                };

                db.Runs.Add(newRun);
                await db.SaveChangesAsync();
                return Results.Ok(new { message = "Artifact selected and Run started" });
            }).RequireAuthorization();

            app.MapGet("/api/artifacts/current", async (System.Security.Claims.ClaimsPrincipal user, AppDbContext db) =>
            {
                var userIdStr = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdStr == null) return Results.Unauthorized();
                var userId = int.Parse(userIdStr);

                var activeRun = await db.Runs
                    .Include(r => r.Artifact)
                    .OrderByDescending(r => r.CreatedDate)
                    .FirstOrDefaultAsync(r => r.UserId == userId && r.IsActive);

                return Results.Ok(activeRun?.Artifact);
            }).RequireAuthorization();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();

                // Seed Games if they don't exist
                if (!db.Games.Any())
                {
                    db.Games.AddRange(
                        new Games { Id = 1, GameName = "CoinFlip" },
                        new Games { Id = 2, GameName = "BlackJack" },
                        new Games { Id = 3, GameName = "RockPaperScissors" }
                    );
                    db.Database.OpenConnection();
                    try
                    {
                        db.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Games ON");
                        db.SaveChanges();
                        db.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Games OFF");
                    }
                    finally
                    {
                        db.Database.CloseConnection();
                    }
                }
                // Seed Artifacts if they don't exist
                if (!db.Artifacts.Any())
                {
                    db.Artifacts.AddRange(
                        new Artifact { Name = "Soğuk Bellek (Cold Cache)", Description = "İlk 2 kayıpta RAM tüketimi %50 azalır.", EffectType = "RamMultiplierOnLossMultiplier", EffectValue = 0.5 },
                        new Artifact { Name = "Hız Aşırtma (Overclock)", Description = "Kazançlarda x2 RAM geri alırsınız, kayıplar normaldir.", EffectType = "WinMultiplier", EffectValue = 2.0 },
                        new Artifact { Name = "Hata Düzeltme (ECC Memory)", Description = "Sistem çökerse bir kez %25 RAM ile yeniden başlarsınız.", EffectType = "Revive", EffectValue = 1.0 },
                        new Artifact { Name = "Güvenli Mod (Safe Mode)", Description = "RAM tüketimi %30 azalır, risk düşer.", EffectType = "Safety", EffectValue = 0.7 }
                    );
                    db.SaveChanges();
                }
            }

            app.Run();
            
        }
    }

}
