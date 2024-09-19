

using toiec_web.ViewModels.Report;

namespace toiec_web.Services.IService
{
    public interface IReportService
    {
        Task<IEnumerable<ReportViewModel>> GetAllReports();
        Task<IEnumerable<ReportViewModel>> GetAllFalseReports(bool check);
        Task<bool> AddReport(ReportAddModel model);
        Task<bool> UpdateReport(ReportUpdateModel model, Guid idReport);
        Task<bool> DeleteReport(Guid idReport);
    }
}
