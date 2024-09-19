using AutoMapper;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Test;
using toeic_web.ViewModels.Vocabulary;

namespace toeic_web.Services
{
    public class TestService : ITestService
    {
        private readonly ITestRepository _testRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public TestService(ITestRepository testRepository, IMapper mapper, IConfiguration configuration)
        {
            _testRepository = testRepository;
            _mapper = mapper;
            _configuration = configuration;
        }
        public async Task<bool> AddTest(TestAddModel model, string userId)
        {
            var data = _mapper.Map<TestModel>(model);
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

            data.createDate = timeNow;
            data.useDate = timeNow;
            return await _testRepository.AddTest(data, userId);
        }

        public async Task<bool> DeleteTest(Guid testId)
        {
            return await _testRepository.DeleteTest(testId);
        }

        public async Task<IEnumerable<TestViewModel>> GetAllTestByProfessor(string userId)
        {
            var data = await _testRepository.GetAllTestByProfessor(userId);
            var listData = new List<TestViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<TestViewModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<TestViewModel>> GetAllTestByType(string typeName)
        {
            var data = await _testRepository.GetAllTestByType(typeName);
            var listData = new List<TestViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<TestViewModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<TestViewModel>> GetAllTests()
        {
            var data = await _testRepository.GetAllTests();
            var listData = new List<TestViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<TestViewModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<TestViewModel> GetTestById(Guid testId)
        {
            var data = await _testRepository.GetTestById(testId);
            if (data != null)
            {
                var obj = _mapper.Map<TestViewModel>(data);
                return obj;
            }
            return null;
        }

        public async Task<bool> UpdateTest(TestUpdateModel model, Guid testId, string userId)
        {
            var data = _mapper.Map<TestModel>(model);
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

            data.createDate = timeNow;
            data.useDate = timeNow;
            return await _testRepository.UpdateTest(data, testId, userId);
        }
    }
}
