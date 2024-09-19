namespace toeic_web.Models
{
    public class VipStudent
    {
        public Guid idVipStudent { get; set; }
        public Guid idStudent { get; set; }
        public DateTime vipExpire { get; set; }
        public virtual Student Student { get; set; }
    }
}
