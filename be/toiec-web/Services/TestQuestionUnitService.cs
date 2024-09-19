using AutoMapper;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Quiz;
using toeic_web.ViewModels.TestQuestionUnit;

namespace toeic_web.Services
{
    public class TestQuestionUnitService : ITestQuestionUnitService
    {
        private readonly ITestQuestionUnitRepository _testQuestionUnitRepository;
        private readonly IMapper _mapper;

        public TestQuestionUnitService(ITestQuestionUnitRepository testQuestionUnitRepository, IMapper mapper) 
        {
            _testQuestionUnitRepository = testQuestionUnitRepository;
            _mapper = mapper;
        }
        public async Task<bool> AddTestQuestionUnit(TestQuestionUnitAddModel model)
        {
            var data = _mapper.Map<TestQuestionUnitModel>(model);
            return await _testQuestionUnitRepository.AddTestQuestionUnit(data);
        }

        public async Task<bool> DeleteTestQuestionUnit(Guid unitId)
        {
            return await _testQuestionUnitRepository.DeleteTestQuestionUnit(unitId);
        }

        public async Task<IEnumerable<TestQuestionUnitViewModel>> GetAllTestQuestionUnitByPart(Guid partId, Guid testId)
        {
            var data = await _testQuestionUnitRepository.GetAllTestQuestionUnitByPart(partId, testId);
            List<TestQuestionUnitViewModel> listData = new List<TestQuestionUnitViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<TestQuestionUnitViewModel>(dataItem);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<IEnumerable<TestQuestionUnitViewModel>> GetAllTestQuestionUnitByTest(Guid testId)
        {
            var data = await _testQuestionUnitRepository.GetAllTestQuestionUnitByTest(testId);
            List<TestQuestionUnitViewModel> listData = new List<TestQuestionUnitViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<TestQuestionUnitViewModel>(dataItem);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<IEnumerable<TestQuestionUnitViewModel>> GetAllTestQuestionUnits()
        {
            var data = await _testQuestionUnitRepository.GetAllTestQuestionUnits();
            List<TestQuestionUnitViewModel> listData = new List<TestQuestionUnitViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<TestQuestionUnitViewModel>(dataItem);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<TestQuestionUnitViewModel> GetTestQuestionUnitById(Guid unitId)
        {
            var dataItem = await _testQuestionUnitRepository.GetTestQuestionUnitById(unitId);
            if (dataItem != null)
            {
                var obj = _mapper.Map<TestQuestionUnitViewModel>(dataItem);
                return obj;
            }
            return null;
        }

        public async Task<bool> UpdateTestQuestionUnit(TestQuestionUnitUpdateModel model, Guid unitId)
        {    
            var data = _mapper.Map<TestQuestionUnitModel>(model);
            return await _testQuestionUnitRepository.UpdateTestQuestionUnit(data, unitId);
        }
    }
}
