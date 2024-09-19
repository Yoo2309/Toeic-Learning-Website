using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IRecordRepository
    {
        Task<IEnumerable<RecordModel>> GetRecordByUserTest(string userId, Guid testId);
        Task<IEnumerable<RecordModel>> GetRecordByUser(string userId);
        Task<RecordModel> GetRecordByID(Guid recordId);
        Task<bool> AddRecord(RecordModel model);
        Task<bool> UpdateRecord(RecordModel model, Guid idRecord);
    }
}
