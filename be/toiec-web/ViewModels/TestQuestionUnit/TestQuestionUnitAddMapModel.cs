namespace toeic_web.ViewModels.TestQuestionUnit
{
    public class TestQuestionUnitAddMapModel
    {
        //public Guid idQuestionUnit { get; set; }
        public Guid idTest { get; set; }
        public Guid idTestPart { get; set; }
        public string? paragraph { get; set; }
        public IFormFile? audio { get; set; }
        public IFormFile? image { get; set; }
        public string? script { get; set; }
        public string? translation { get; set; }
    }
}
