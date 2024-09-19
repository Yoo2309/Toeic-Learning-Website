namespace toeic_web.Models
{
    public class LessonModel
    {
        public Guid idLesson { get; set; }
        public Guid idCourse { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public bool? isVip { get; set; }
    }
}
