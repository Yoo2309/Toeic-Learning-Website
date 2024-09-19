using toeic_web.Data;
using toiec_web.Data;

namespace toeic_web.Models
{
    public class Test
    {
        public Guid idTest { get; set; }
        public Guid idType { get; set; }
        public Guid idProfessor { get; set; }
        public string? idRoadMap { get; set; }
        public string name { get; set; }
        public DateTime createDate { get; set; }
        public DateTime useDate { get; set; }
        public bool? isVip { get; set; }
        public virtual TestType TestType { get; set; }
        public virtual ICollection<TestQuestionUnit> TestQuestionUnits { get; set; }
        public virtual ICollection<TestRecord> TestRecords { get; set; }    
        public virtual Professor Professor { get; set; }
        public virtual RoadMap RoadMap { get; set; }


    }
}
