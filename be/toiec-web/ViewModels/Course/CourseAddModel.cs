namespace toeic_web.ViewModels.Course
{
    public class CourseAddModel
    {
        public Guid idCourse { get; set; }
        public string idUser { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool? isVip { get; set; }
    }
}
