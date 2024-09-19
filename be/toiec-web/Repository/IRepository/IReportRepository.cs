using toiec_web.Models;

namespace toiec_web.Repository.IRepository
{
    public interface IReportRepository
    {
        Task<IEnumerable<ReportModel>> GetAllReports();
        Task<IEnumerable<ReportModel>> GetAllFalseReports(bool check);
        Task<bool> AddReport(ReportModel model);
        Task<bool> UpdateReport(ReportModel model, Guid idReport);
        Task<bool> DeleteReport(Guid idReport);
    }
}
