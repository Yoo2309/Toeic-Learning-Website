namespace toeic_web.ViewModels.Course
{
    public class CourseViewModel
    {
        public Guid idCourse { get; set; }
        public string? idRoadMap { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool? isVip { get; set; }
    }
}
