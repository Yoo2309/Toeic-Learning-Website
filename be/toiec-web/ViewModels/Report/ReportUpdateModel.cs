namespace toiec_web.ViewModels.Report
{
    public class ReportUpdateModel
    {
        public Guid idComment { get; set; }
        public string idUser { get; set; }
        public string reason { get; set; }
        public DateTime reportDate { get; set; }
        public string? checkNote { get; set; }
        public bool commentDeleted { get; set; }
        public bool isCheck { get; set; }
    }
}
