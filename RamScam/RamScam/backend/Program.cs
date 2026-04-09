using Microsoft.EntityFrameworkCore;
using RamScam.backend.DAL;
using RamScam.backend.DAL.Concrete;
using RamScam.backend.DAL.Interfaces;
using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Services;

namespace RamScam.backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

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
            #endregion


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }


            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();

            

            app.Run();
        }
    }
}
