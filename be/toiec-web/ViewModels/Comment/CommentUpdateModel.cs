namespace toiec_web.ViewModels.Comment
{
    public class CommentUpdateModel
    {
        public Guid idLesson { get; set; }
        public string idUser { get; set; }
        public Guid? idCommentReply { get; set; }
        public string content { get; set; }
        public DateTime createdDate { get; set; }
        public bool isDeleted { get; set; }
    }
}
