using toeic_web.Data;

namespace toeic_web.Models
{
    public class TestQuestionUnit
    {
        public Guid idQuestionUnit { get; set; }
        public Guid idTest { get; set; }
        public Guid idTestPart { get; set; }
        public string? paragraph { get; set; }
        public string? audio { get; set; }
        public string? image { get; set; }
        public string? script { get; set; }
        public string? translation { get; set; }
        public virtual Test Test { get; set; }
        public virtual TestPart TestPart { get; set; }
        public virtual ICollection<Question> Questions { get; set; }


    }
}
