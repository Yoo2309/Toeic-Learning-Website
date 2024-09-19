namespace toeic_web.Models
{
    public class Quiz
    {
        public Guid idQuiz {  get; set; }
        public Guid idLesson { get; set; }
        public string title { get; set;}
        public virtual Lesson Lesson { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
