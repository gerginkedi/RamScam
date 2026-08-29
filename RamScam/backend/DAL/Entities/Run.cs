using System.ComponentModel.DataAnnotations.Schema;

namespace RamScam.backend.DAL.Entities
{
    public class Run : BaseEntity
    {
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public int? ArtifactId { get; set; }
        [ForeignKey("ArtifactId")]
        public virtual Artifact? Artifact { get; set; }

        public bool IsActive { get; set; } = true;
        public int InitialRamMb { get; set; }
    }
}
