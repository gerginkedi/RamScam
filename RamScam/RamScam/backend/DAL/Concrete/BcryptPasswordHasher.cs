using Microsoft.AspNetCore.Identity;
using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Concrete
{
    public class BcryptPasswordHasher : IPasswordHasher
    {
       
        public async Task<string> HashAsync(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        }
        public async Task<bool> VerifyAsync(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
