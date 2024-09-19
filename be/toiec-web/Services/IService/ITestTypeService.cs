using toeic_web.Models;
using toeic_web.ViewModels.TestType;

namespace toeic_web.Services.IService
{
    public interface ITestTypeService
    {
        Task<IEnumerable<TestTypeViewModel>> GetAllTestTypes();
        Task<TestTypeViewModel> GetTestTypeById(Guid typeId);
        Task<TestTypeViewModel> GetTestTypeByTypeName(string typeName);
        Task<string> GetTypeNameByTest(Guid idTest);
        Task<bool> AddTestType(TestTypeAddModel model);
        Task<bool> UpdateTestType(TestTypeUpdateModel model, Guid typeId);
        Task<bool> DeleteTestType(Guid typeId);
    }
}
