namespace RamScam.backend.DAL.Entities
{
    public class User : BaseEntity
    {
        public string EMail{ get; set; }
        public string HashedPassword{ get; set; }
        public int? SelectedArtifactId { get; set; }
        public virtual Artifact? SelectedArtifact { get; set; }
    }
}
