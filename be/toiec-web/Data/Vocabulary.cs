namespace toeic_web.Models
{
    public class Vocabulary
    {
        public Guid idVoc { get; set; }
        public Guid idList { get; set; }
        public string? topic { get; set; }
        public string engWord { get; set; }
        public string? pronunciation { get; set; }
        public string? wordType { get; set; }
        public string meaning { get; set; }
        public string? image { get; set; }
        public string? example { get; set; }
        public bool status { get; set; }
        public virtual VocList VocTopic { get; set; }
    }
}
