namespace RamScam.backend.DAL.Entities
{
    public class User : BaseEntity
    {
        public string Username{ get; set; }
        public string EMail{ get; set; }
        public string HashedPassword{ get; set; }
    }
}
