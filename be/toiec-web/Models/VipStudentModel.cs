namespace toeic_web.Models
{
    public class VipStudentModel
    {
        public Guid idVipStudent { get; set; }
        public Guid idStudent { get; set; }
        public DateTime vipExpire { get; set; }
    }
}
