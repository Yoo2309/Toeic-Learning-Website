namespace toeic_web.ViewModels.Lesson
{
    public class LessonUpdateModel
    {
        public Guid idCourse { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public bool? isVip { get; set; }
    }
}
