namespace toiec_web.Models
{
    public class ChatAvailableModel
    {
        public string idUser { get; set; }
        public int availableChat { get; set; }
        public DateTime lastReset { get; set; }
    }
}
