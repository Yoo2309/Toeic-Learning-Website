using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface ITestPartRepository
    {
        Task<IEnumerable<TestPartModel>> GetAllTestParts();
        public Task<Guid> GetPartByUnit(Guid partId);
    }
}
