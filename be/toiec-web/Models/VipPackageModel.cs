namespace toeic_web.Models
{
    public class VipPackageModel
    {
        public Guid idPackage { get; set; }
        public Guid idAdmin { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public double price { get; set; }
        public int duration { get; set; }
    }
}
