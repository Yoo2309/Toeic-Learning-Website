namespace toeic_web.Models
{
    public class UserAnswer
    {
        public Guid idUAnswer { get; set; }
        public Guid idQuestion { get; set; }
        public Guid idRecord { get; set; }
        public Guid idStudent { get; set; }
        public string userChoice { get; set; }
        public bool state { get; set; }
        public virtual Question Question { get; set; }  
        public virtual TestRecord TestRecord { get; set; }  
        public virtual Student Student { get; set; }
    }
}
