using System.ComponentModel.DataAnnotations;

namespace toeic_web.ViewModels.Test
{
    public class TestViewModel
    {
        public Guid idTest { get; set; }
        public Guid idType { get; set; }
        public string? idRoadMap { get; set; }
        public string name { get; set; }
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yy H:mm:ss}", ApplyFormatInEditMode = true)]
        public string createDate { get; set; }
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yy H:mm:ss}", ApplyFormatInEditMode = true)]
        public string useDate { get; set; }
        public bool? isVip { get; set; }
    }
}
