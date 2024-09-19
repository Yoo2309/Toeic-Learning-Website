using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.TestType;
using toeic_web.ViewModels.VocTopic;

namespace toeic_web.Services
{
    public class TestTypeService : ITestTypeService
    {
        private readonly ITestTypeRepository _testTypeRepository;
        private readonly IMapper _mapper;
        public TestTypeService(ITestTypeRepository testTypeRepository, IMapper mapper) 
        {
            _testTypeRepository = testTypeRepository;
            _mapper = mapper;
        }

        public async Task<bool> AddTestType(TestTypeAddModel model)
        {
            var data = _mapper.Map<TestTypeModel>(model);
            return await _testTypeRepository.AddTestType(data);
        }

        public async Task<bool> DeleteTestType(Guid typeId)
        {
            return await _testTypeRepository.DeleteTestType(typeId);
        }

        public async Task<IEnumerable<TestTypeViewModel>> GetAllTestTypes()
        {
            var data = await _testTypeRepository.GetAllTestTypes();
            List<TestTypeViewModel> listData = new List<TestTypeViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<TestTypeViewModel>(item);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<TestTypeViewModel> GetTestTypeById(Guid typeId)
        {
            var data = await _testTypeRepository.GetTestTypeById(typeId);
            if (data != null)
            {
                var obj = _mapper.Map<TestTypeViewModel>(data);
                return obj;
            }
            return null;
        }

        public async Task<TestTypeViewModel> GetTestTypeByTypeName(string typeName)
        {
            var data = await _testTypeRepository.GetTestTypeByTypeName(typeName);
            if (data != null)
            {
                var obj = _mapper.Map<TestTypeViewModel>(data);
                return obj;
            }
            return null;
        }

        public async Task<string> GetTypeNameByTest(Guid idTest)
        {
            return await _testTypeRepository.GetTypeNameByTest(idTest);
        }

        public async Task<bool> UpdateTestType(TestTypeUpdateModel model, Guid typeId)
        {
            var data = _mapper.Map<TestTypeModel>(model);
            return await _testTypeRepository.UpdateTestType(data, typeId);  
        }
    }
}
