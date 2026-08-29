namespace RamScam.backend.DAL.Entities
{
    public class Artifact : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string EffectType { get; set; }
        public double EffectValue { get; set; }
    }
}
