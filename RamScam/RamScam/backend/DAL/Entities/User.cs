namespace RamScam.backend.DAL.Entities
{
    public class User : BaseEntity
    {
        public string Username{ get; set; }
        public string EMailCodded{ get; set; }
        public string PasswordCodded{ get; set; }
        
    }
}
