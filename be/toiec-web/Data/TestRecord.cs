namespace toeic_web.Models
{
    public class TestRecord
    {
        public Guid idRecord { get; set; }
        public Guid idTest { get; set; }
        public Guid idStudent { get; set; }
        public DateTime createDate { get; set; }
        public int listenCorrect { get; set; }
        public int listenScore { get; set; }
        public int readingCorrect { get; set; }
        public int readScore { get; set; }
        public int correctAns { get; set; }
        public int wrongAns { get; set; }
        public int totalScore { get; set; }
        public virtual Test Test { get; set; }
        public virtual ICollection<UserAnswer> UserAnswers { get; set; }
        public virtual Student Student { get; set; }
    }
}