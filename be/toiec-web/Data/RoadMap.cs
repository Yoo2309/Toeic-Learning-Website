using toeic_web.Models;

namespace toiec_web.Data
{
    public class RoadMap
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }        
        public virtual ICollection<Course> Courses { get; set; }
        public virtual ICollection<Test> Tests { get; set; }
        public virtual ICollection<VocList> VocLists { get; set; }
        public virtual ICollection<UserRoute> UserRoutes { get; set; }
    }
}
