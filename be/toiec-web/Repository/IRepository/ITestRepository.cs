using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface ITestRepository
    {
        Task<IEnumerable<TestModel>> GetAllTests();
        Task<TestModel> GetTestById(Guid testId);
        Task<IEnumerable<TestModel>> GetAllTestByProfessor(string userId);
        Task<IEnumerable<TestModel>> GetAllTestByType(string typeName);
        Task<bool> AddTest(TestModel model, string userId);
        Task<bool> UpdateTest(TestModel model, Guid testId, string userId);
        Task<bool> DeleteTest(Guid testId);
    }
}
