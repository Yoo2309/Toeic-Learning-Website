using toeic_web.Models;
using toeic_web.ViewModels.TestPart;

namespace toeic_web.Services.IService
{
    public interface ITestPartService
    {
        Task<IEnumerable<TestPartViewModel>> GetAllTestParts();
    }
}
