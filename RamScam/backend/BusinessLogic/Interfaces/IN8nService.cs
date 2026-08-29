using System.Threading.Tasks;

namespace RamScam.backend.BusinessLogic.Interfaces
{
    public interface IN8nService
    {
        Task<string> GetFunFactAsync();
        Task SendRegistrationEmailAsync(string email);
    }
}