namespace toeic_web.Models
{
    public class CourseModel
    {
        public Guid idCourse { get; set; }
        public string idUser { get; set; }
        public string? idRoadMap { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool? isVip { get; set; }
    }
}
