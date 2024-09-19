using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Record;

namespace toeic_web.Services
{
    public class RecordService : IRecordService
    {
        private readonly IRecordRepository _recordRepository;
        private readonly IMapper _mapper;
        private readonly ITestRepository _testRepository;

        public RecordService(IRecordRepository recordRepository, IMapper mapper, ITestRepository testRepository)
        {
            _recordRepository = recordRepository;
            _mapper = mapper;
            _testRepository = testRepository;
        }

        public async Task<RecordViewModel> GetRecordByID(Guid recordId)
        {
            var dataItem = await _recordRepository.GetRecordByID(recordId);
            //get testName
            var test = await _testRepository.GetTestById(dataItem.idTest);
            if (dataItem != null)
            {
                var obj = _mapper.Map<RecordViewModel>(dataItem);
                obj.testName = test.name;
                return obj;
            }
            return null;
        }

        public async Task<IEnumerable<RecordViewModel>> GetRecordByUser(string userId)
        {
            var data = await _recordRepository.GetRecordByUser(userId);
            var listData = new List<RecordViewModel>();

            foreach (var record in data)
            {
                //get testName
                var test = await _testRepository.GetTestById(record.idTest);

                var obj = _mapper.Map<RecordViewModel>(record);
                obj.testName = test.name;
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<IEnumerable<RecordViewModel>> GetRecordByUserTest(string userId, Guid testId)
        {
            var data = await _recordRepository.GetRecordByUserTest(userId, testId);
            var test = await _testRepository.GetTestById(testId);
            var listData = new List<RecordViewModel>();

            foreach (var record in data)
            {
                var obj = _mapper.Map<RecordViewModel>(record);
                obj.testName = test.name;
                listData.Add(obj);
            }
            return listData;
        }
    }
}