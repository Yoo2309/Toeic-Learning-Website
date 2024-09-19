using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class TestQuestionUnitRepository : Repository<TestQuestionUnit>, ITestQuestionUnitRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IUploadFileRepository _uploadFileRepository;

        public TestQuestionUnitRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper, 
            IUploadFileRepository uploadFileRepository) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _uploadFileRepository = uploadFileRepository;
        }

        public  Task<bool> AddTestQuestionUnit(TestQuestionUnitModel model)
        {
            try
            {
                var unit = _mapper.Map<TestQuestionUnit>(model);
                unit.idQuestionUnit = Guid.NewGuid();
                Entities.Add(unit);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteTestQuestionUnit(Guid unitId)
        {
            var unit = GetById(unitId);
            if (unit == null)
            {
                throw new ArgumentNullException(nameof(unit));
            }
            Entities.Remove(unit);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<TestQuestionUnitModel>> GetAllTestQuestionUnitByPart(Guid partId, Guid testId)
        {
            var listData = new List<TestQuestionUnitModel>();
            var data = await GetAllTestQuestionUnitByTest(testId);
            foreach (var item in data)
            {
                if (item.idTestPart == partId)
                {
                    var obj = _mapper.Map<TestQuestionUnitModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<TestQuestionUnitModel>> GetAllTestQuestionUnitByTest(Guid testId)
        {
            var listData = new List<TestQuestionUnitModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                if (item.idTest == testId)
                {
                    var obj = _mapper.Map<TestQuestionUnitModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<TestQuestionUnitModel>> GetAllTestQuestionUnits()
        {
            var listData = new List<TestQuestionUnitModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<TestQuestionUnitModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<TestQuestionUnitModel> GetTestQuestionUnitById(Guid unitId)
        {
            IAsyncEnumerable<TestQuestionUnit> units = Entities.AsAsyncEnumerable();
            await foreach (var unit in units)
            {
                if (unit.idQuestionUnit == unitId)
                {
                    var data = _mapper.Map<TestQuestionUnitModel>(unit);
                    return data;
                }
            }
            return null;
        }

        public async Task<Guid> GetTestQuestionUnitByQuestion(Guid unitId)
        {
            var unit = await Entities.FirstOrDefaultAsync(u => u.idQuestionUnit == unitId);
            if (unit != null)
            {
                var data = _mapper.Map<TestQuestionUnitModel>(unit);
                return data.idQuestionUnit;
            }

            return Guid.Empty;
        }

        public async Task<bool> UpdateTestQuestionUnit(TestQuestionUnitModel model, Guid unitId)
        {
            try
            {
                var unit = await GetTestQuestionUnitById(unitId);

                //check exist file
                if (model.image != null)
                {
                    if (unit.image != null)
                    {
                        await _uploadFileRepository.DeleteFileAsync(unit.image);
                    }
                }
                if (model.audio != null)
                {
                    if (unit.audio != null)
                    {
                        await _uploadFileRepository.DeleteFileAsync(unit.audio);
                    }
                }

                var obj = _mapper.Map<TestQuestionUnit>(model);
                obj.idQuestionUnit = unitId;
                Entities.Update(obj);
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
