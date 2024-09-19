using toeic_web.Models;

namespace toiec_web.Data
{
    public class UserRoute
    {
        public Guid Id { get; set; }
        public string IdRoadMap { get; set; }
        public string IdUser { get; set; }
        public string Status { get; set; }
        public double Progress { get; set; }
        public virtual RoadMap RoadMap { get; set; }
        public virtual Users Users { get; set; }
    }
}
