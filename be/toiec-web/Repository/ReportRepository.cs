using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toiec_web.Models;
using toiec_web.Repository.IRepository;
using toiec_web.ViewModels.Report;

namespace toiec_web.Repository
{
    public class ReportRepository : Repository<Report>, IReportRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        

        public ReportRepository(ToeicDbContext dbContext, IUnitOfWork unitOfWork, IMapper mapper) : base(dbContext)
        {
            _uow = unitOfWork;
            _mapper = mapper;
            
        }

        public Task<bool> AddReport(ReportModel model)
        {
            try
            {
                var report = _mapper.Map<Report>(model);
                report.idReport = new Guid();
                Entities.Add(report);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<bool> DeleteReport(Guid idReport)
        {
            var report = GetById(idReport);
            if (report == null)
            {
                throw new ArgumentNullException(nameof(report));
            }
            Entities.Remove(report);
            _uow.SaveChanges();
            return Task.FromResult(true);
        }

        public async Task<IEnumerable<ReportModel>> GetAllFalseReports(bool check)
        {
            var data = await GetAllReports();
            var listData = new List<ReportModel>();
            if (data != null)
            {
                foreach (var report in data)
                {
                    if(report.isCheck == check)
                    {
                        var obj = _mapper.Map<ReportModel>(report);
                        listData.Add(obj);
                    }
                }
            }
            return listData;
        }

        public async Task<IEnumerable<ReportModel>> GetAllReports()
        {
            var data = await Entities.ToListAsync();
            var listData = new List<ReportModel>();
            if (data != null)
            {
                foreach (var report in data)
                {
                    var obj = _mapper.Map<ReportModel>(report);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public Task<bool> UpdateReport(ReportModel model, Guid idReport)
        {
            try
            {
                var report = _mapper.Map<Report>(model);
                report.idReport = idReport;   
                Entities.Update(report);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
