using System.ComponentModel.DataAnnotations;

namespace toeic_web.ViewModels.VocTopic
{
    public class VocListViewModel
    {
        public Guid idVocList { get; set; }
        public string idUser { get; set; }
        public string? idRoadMap { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string author { get; set; }
        public double quantity { get; set; }
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yy H:mm:ss}", ApplyFormatInEditMode = true)]
        public string createDate { get; set; }
        public string status { get; set; }
        public bool isPublic { get; set; }
    }
}
