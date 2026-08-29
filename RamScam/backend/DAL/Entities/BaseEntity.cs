using RamScam.backend.DAL.Interfaces;

namespace RamScam.backend.DAL.Entities
{
    public class BaseEntity : IBaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
