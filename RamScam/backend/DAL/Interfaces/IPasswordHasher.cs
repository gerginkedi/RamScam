namespace RamScam.backend.DAL.Interfaces
{
    public interface IPasswordHasher
    {
        Task<string> HashAsync(string password);
        Task<bool> VerifyAsync(string password, string hashedPassword);
    }
}
