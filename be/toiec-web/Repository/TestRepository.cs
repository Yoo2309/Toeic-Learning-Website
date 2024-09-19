using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class TestRepository : Repository<Test>, ITestRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IProfessorRepository _professorRepository;
        private readonly ITestTypeRepository _testTypeRepository;

        public TestRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper,
            IProfessorRepository professorRepository, ITestTypeRepository testTypeRepository) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _professorRepository = professorRepository;
            _testTypeRepository = testTypeRepository;
        }

        public async Task<bool> AddTest(TestModel model, string userId)
        {
            try
            {
                //get professor by userId
                var professor = await _professorRepository.GetProfessorByUserId(userId);

                var test = _mapper.Map<Test>(model);
                test.idTest = Guid.NewGuid();
                test.idProfessor = professor.idProfessor;
                Entities.Add(test);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteTest(Guid testId)
        {
            var test = GetById(testId);
            if (test == null)
            {
                throw new ArgumentNullException(nameof(test));
            }
            Entities.Remove(test);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<TestModel>> GetAllTestByProfessor(string userId)
        {
            //get professor by userId
            var professor = await _professorRepository.GetProfessorByUserId(userId);

            var listData = new List<TestModel>();
            var data = await Entities.OrderBy(t => t.name).ToListAsync();
            foreach (var item in data)
            {
                if (item.idProfessor == professor.idProfessor)
                {
                    var obj = _mapper.Map<TestModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<TestModel>> GetAllTestByType(string typeName)
        {
            //get idTestType
            var type = await _testTypeRepository.GetTestTypeByTypeName(typeName);

            var listData = new List<TestModel>();
            var data = await Entities.OrderBy(t => t.name).ToListAsync();
            foreach (var item in data)
            {
                if(item.idType == type.idTestType)
                {
                    var obj = _mapper.Map<TestModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<TestModel>> GetAllTests()
        {
            var listData = new List<TestModel>();
            var data = await Entities.OrderBy(t => t.name).ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<TestModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<TestModel> GetTestById(Guid testId)
        {
            IAsyncEnumerable<Test> tests = Entities.AsAsyncEnumerable();
            await foreach (var test in tests)
            {
                if (test.idTest == testId)
                {
                    TestModel data = _mapper.Map<TestModel>(test);
                    return data;
                }
            }
            return null;
        }

        public async Task<bool> UpdateTest(TestModel model, Guid testId, string userId)
        {
            try
            {
                //get professor by userId
                var professor = await _professorRepository.GetProfessorByUserId(userId);

                var test = _mapper.Map<Test>(model);
                test.idTest = testId;
                test.idProfessor = professor.idProfessor;
                Entities.Update(test);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
