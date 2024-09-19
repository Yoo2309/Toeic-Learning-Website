namespace toeic_web.Models
{
    public class Comment
    {
        public Guid idComment { get; set; }
        public Guid idLesson { get; set; }
        public Guid? idCommentReply { get; set; }
        public string idUser { get; set; }
        public string content { get; set; }
        public DateTime createdDate { get; set; }
        public bool isDeleted {  get; set; }
        public virtual Users Users { get; set; }
        public virtual Lesson Lessons { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
    }
}
