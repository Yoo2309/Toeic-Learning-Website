namespace toeic_web.ViewModels.TestQuestionUnit
{
    public class TestQuestionUnitUpdateModel
    {
        public Guid idTest { get; set; }
        public Guid idTestPart { get; set; }
        public string? paragraph { get; set; }
        public string? audio { get; set; }
        public string? image { get; set; }
        public string? script { get; set; }
        public string? translation { get; set; }
    }
}
