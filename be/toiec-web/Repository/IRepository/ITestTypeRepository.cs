using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface ITestTypeRepository
    {
        Task<IEnumerable<TestTypeModel>> GetAllTestTypes();
        Task<TestTypeModel> GetTestTypeById(Guid typeId);
        Task<TestTypeModel> GetTestTypeByTypeName(string typeName);
        Task<string> GetTypeNameByTest(Guid idTest);
        Task<bool> AddTestType(TestTypeModel model);
        Task<bool> UpdateTestType(TestTypeModel model, Guid typeId);
        Task<bool> DeleteTestType(Guid typeId);
    }
}
