namespace toeic_web.Models
{
    public class Student
    {
        public Guid idStudent {  get; set; }
        public string idUser { get; set; }
        public bool freeTest { get; set; }
        public virtual Users Users { get; set; }
        public virtual VipStudent VipStudent { get; set;}
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<UserAnswer> UserAnswers { get; set; }
        public virtual ICollection<TestRecord> TestRecords { get; set; }
    }
}
