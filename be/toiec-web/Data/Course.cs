using toiec_web.Data;

namespace toeic_web.Models
{
    public class Course
    {
        public Guid idCourse { get; set; }
        public Guid idProfessor { get; set; }
        public string? idRoadMap { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool? isVip { get; set; }
        public virtual ICollection<Lesson> Lessons { get; set; }
        public virtual Professor Professor { get; set; }
        public virtual RoadMap RoadMap { get; set; }
    }
}
