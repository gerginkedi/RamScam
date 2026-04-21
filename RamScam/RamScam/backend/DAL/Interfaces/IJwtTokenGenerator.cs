namespace RamScam.backend.DAL.Interfaces
{
    public interface IJwtTokenGenerator
    {
        public string Generate(int userId, string email);
    }
}
