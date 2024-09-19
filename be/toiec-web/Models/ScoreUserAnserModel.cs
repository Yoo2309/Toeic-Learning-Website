namespace toeic_web.Models
{
    public class ScoreUserAnserModel
    {
        public int listenCorrect { get; set; }
        public int listenScore { get; set; }
        public int readingCorrect { get; set; } 
        public int readScore { get; set; }
        public int correctAns { get; set; }
        public int wrongAns { get; set; }
        public int totalScore { get; set; }
    }
}
