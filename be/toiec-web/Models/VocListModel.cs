namespace toeic_web.Models
{
    public class VocListModel
    {
        public Guid idVocList { get; set; }
        public string idUser { get; set; }
        public string? idRoadMap { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string author { get; set; }
        public double quantity { get; set; }
        public DateTime createDate { get; set; }
        public string status { get; set; }
        public bool isPublic { get; set; }
    }
}
