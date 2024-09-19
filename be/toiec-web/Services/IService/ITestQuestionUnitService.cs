
using toeic_web.ViewModels.TestQuestionUnit;

namespace toeic_web.Services.IService
{
    public interface ITestQuestionUnitService
    {
        Task<IEnumerable<TestQuestionUnitViewModel>> GetAllTestQuestionUnits();
        Task<TestQuestionUnitViewModel> GetTestQuestionUnitById(Guid unitId);
        Task<IEnumerable<TestQuestionUnitViewModel>> GetAllTestQuestionUnitByTest(Guid testId);
        Task<IEnumerable<TestQuestionUnitViewModel>> GetAllTestQuestionUnitByPart(Guid partId, Guid testId);
        Task<bool> AddTestQuestionUnit(TestQuestionUnitAddModel model);
        Task<bool> UpdateTestQuestionUnit(TestQuestionUnitUpdateModel model, Guid unitId);
        Task<bool> DeleteTestQuestionUnit(Guid unitId);
    }
}
