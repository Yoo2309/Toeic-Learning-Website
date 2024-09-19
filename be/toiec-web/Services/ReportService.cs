using AutoMapper;
using Microsoft.AspNetCore.Identity;
using toeic_web.Models;
using toiec_web.Models;
using toiec_web.Repository;
using toiec_web.Repository.IRepository;
using toiec_web.Services.IService;
using toiec_web.ViewModels.Report;

namespace toiec_web.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;
        private readonly ICommentRepository _commentRepository;
        private readonly UserManager<Users> _userManager;
        private readonly IConfiguration _configuration;

        public ReportService(IReportRepository reportRepository, IMapper mapper,
            ICommentRepository commentRepository, UserManager<Users> userManager, IConfiguration configuration)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _commentRepository = commentRepository;
            _userManager = userManager;
            _configuration = configuration;
        }
        public Task<bool> AddReport(ReportAddModel model)
        {
            try
            {
                var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
                var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
                var data = _mapper.Map<ReportModel>(model);
                data.reportDate = timeNow;
                return _reportRepository.AddReport(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<bool> DeleteReport(Guid idReport)
        {
            try
            {
                return _reportRepository.DeleteReport(idReport);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<ReportViewModel>> GetAllFalseReports(bool check)
        {
            var data = await _reportRepository.GetAllFalseReports(check);
            var listData = new List<ReportViewModel>();
            if (data != null)
            {
                foreach (var report in data)
                {
                    var cmt = await _commentRepository.GetCommentById(report.idComment);
                    var reporter = await _userManager.FindByIdAsync(report.idUser);
                    var accused = await _userManager.FindByIdAsync(cmt.idUser);

                    var obj = _mapper.Map<ReportViewModel>(report);
                    obj.reporterUsername = reporter.UserName;
                    obj.accusedUsername = accused.UserName;
                    obj.content = cmt.content;
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<ReportViewModel>> GetAllReports()
        {
            var data = await _reportRepository.GetAllReports();
            var listData = new List<ReportViewModel>();
            if (data != null)
            {
                foreach (var report in data)
                {
                    var cmt = await _commentRepository.GetCommentById(report.idComment);
                    var reporter = await _userManager.FindByIdAsync(report.idUser);
                    var accused = await _userManager.FindByIdAsync(cmt.idUser);

                    var obj = _mapper.Map<ReportViewModel>(report);
                    obj.reporterUsername = reporter.UserName;
                    obj.accusedUsername = accused.UserName;
                    obj.content = cmt.content;
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<bool> UpdateReport(ReportUpdateModel model, Guid idReport)
        {
            try
            {
                var data = _mapper.Map<ReportModel>(model);
                var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
                var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
                data.reportDate = timeNow;
                var updateCmt = false;
                if (data == null)
                {
                    return false;
                }
                var comment = await _commentRepository.GetCommentById(model.idComment);
                if (comment != null)
                {
                    updateCmt = await _commentRepository
                        .UpdateReportComment(comment, model.idComment, model.commentDeleted);
                }
                if (!updateCmt)
                {
                    throw new Exception("Fail to update comment.");
                }
                return await _reportRepository.UpdateReport(data, idReport);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
