namespace RamScam.backend.BusinessLogic.Models.DTOs
{
    public class RequestDTOs
    {
        public record RegisterRequestDTO(string Email, string Password);
        public record LoginRequestDTO(string Email, string Password);
    }
}
