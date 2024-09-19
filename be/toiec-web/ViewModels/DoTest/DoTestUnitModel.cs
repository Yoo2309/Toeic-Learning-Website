using toeic_web.Models;

namespace toeic_web.ViewModels.DoTest
{
    public class DoTestUnitModel
    {
        public Guid idQuestionUnit { get; set; }
        public Guid partId { get; set; }
        public string? paragraph { get; set; }
        public string? audio { get; set; }
        public string? image { get; set; }
        public string? script { get; set; }
        public string? translation { get; set; }
        public IEnumerable<DoTestQuestionModel> questions { get; set; }
    }
}
