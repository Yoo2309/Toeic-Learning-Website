using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface ITestQuestionUnitRepository
    {
        Task<IEnumerable<TestQuestionUnitModel>> GetAllTestQuestionUnits();
        Task<TestQuestionUnitModel> GetTestQuestionUnitById(Guid unitId);        
        Task<IEnumerable<TestQuestionUnitModel>> GetAllTestQuestionUnitByTest(Guid testId);
        Task<IEnumerable<TestQuestionUnitModel>> GetAllTestQuestionUnitByPart(Guid partId, Guid testId);
        public Task<Guid> GetTestQuestionUnitByQuestion(Guid unitId);
        Task<bool> AddTestQuestionUnit(TestQuestionUnitModel model);
        Task<bool> UpdateTestQuestionUnit(TestQuestionUnitModel model, Guid unitId);
        Task<bool> DeleteTestQuestionUnit(Guid unitId);
    }
}
