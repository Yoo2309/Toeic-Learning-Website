using System.ComponentModel.DataAnnotations;

namespace toeic_web.ViewModels.Record
{
    public class RecordViewModel
    {
        public Guid idRecord { get; set; }
        public Guid idTest { get; set; }
        public Guid idStudent { get; set; }
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yy H:mm:ss}", ApplyFormatInEditMode = true)]
        public string createDate { get; set; }
        public int listenCorrect { get; set; }
        public int listenScore { get; set; }
        public int readingCorrect { get; set; }
        public int readScore { get; set; }
        public int correctAns { get; set; }
        public int wrongAns { get; set; }
        public int totalScore { get; set; }
        public string? testName { get; set; } = null;
    }
}