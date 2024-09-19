namespace toeic_web.ViewModels.Lesson
{
    public class LessonViewModel
    {
        public Guid idLesson { get; set; }
        public Guid idCourse { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public bool? isVip { get; set; }
    }
}
