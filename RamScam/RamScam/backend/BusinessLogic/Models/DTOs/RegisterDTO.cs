namespace RamScam.backend.BusinessLogic.Models.DTOs
{
    public class RegisterDTO
    {
        //takes email and raw password from frontend
        public string Email { get; set; }   
        public string RawPassword { get; set; }
    }
}
