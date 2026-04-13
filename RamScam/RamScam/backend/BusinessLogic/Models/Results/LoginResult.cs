namespace RamScam.backend.BusinessLogic.Models.Results
{
    public class LoginResult : BaseResult
    {
        public int UserId { get; set; }
        public string? Token { get; set; }
    }
}
