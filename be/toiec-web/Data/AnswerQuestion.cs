namespace toeic_web.Models
{
    public class AnswerQuestion
    {
        public Guid idAnswer { get; set; }
        public Guid idQuestion { get; set; }
        public string content { get; set; }
        public virtual Question Question { get; set; }        
    }
}
