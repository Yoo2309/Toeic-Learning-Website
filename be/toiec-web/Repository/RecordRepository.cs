using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class RecordRepository : Repository<TestRecord>, IRecordRepository
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStudentRepository _studentRepository;
        private readonly IConfiguration _configuration;

        public RecordRepository(ToeicDbContext dbContext, IMapper mapper, IUnitOfWork unitOfWork,
            IStudentRepository studentRepository,IConfiguration configuration)
            : base(dbContext)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _studentRepository = studentRepository;
            _configuration = configuration;
        }

        public Task<bool> AddRecord(RecordModel model)
        {
            try
            {
                var record = _mapper.Map<TestRecord>(model);
                var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
                var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
                record.createDate = timeNow;
                Entities.Add(record);
                _unitOfWork.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public Task<bool> UpdateRecord(RecordModel model, Guid idRecord)
        {
            try
            {
                var record = _mapper.Map<TestRecord>(model);
                var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
                var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
                record.createDate = timeNow;
                record.idRecord = idRecord;
                Entities.Update(record);
                _unitOfWork.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<IEnumerable<RecordModel>> GetRecordByUserTest(string userId, Guid testId)
        {
            //get student id
            var student = await _studentRepository.GetStudentByUserId(userId);

            var listData = new List<RecordModel>();
            var data = await Entities.ToListAsync();

            foreach (var record in data)
            {
                if (record.idTest == testId && record.idStudent == student.idStudent)
                {
                    var obj = _mapper.Map<RecordModel>(record);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<RecordModel>> GetRecordByUser(string userId)
        {
            //get student id
            var student = await _studentRepository.GetStudentByUserId(userId);

            var listData = new List<RecordModel>();
            var data = await Entities.ToListAsync();

            foreach (var record in data)
            {
                if (record.idStudent == student.idStudent)
                {
                    var obj = _mapper.Map<RecordModel>(record);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<RecordModel> GetRecordByID(Guid recordId)
        {
            IAsyncEnumerable<TestRecord> records = Entities.AsAsyncEnumerable();
            await foreach (var record in records)
            {
                if (record.idRecord == recordId)
                {
                    RecordModel data = _mapper.Map<RecordModel>(record);
                    return data;
                }
            }
            return null;
        }
    }
}