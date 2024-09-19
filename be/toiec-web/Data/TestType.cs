namespace toeic_web.Models
{
    public class TestType
    {
        public Guid idTestType { get; set; }
        public string typeName { get; set; }
        public virtual ICollection<Test> Tests { get; set; }
    }
}
