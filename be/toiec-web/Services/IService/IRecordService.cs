using toeic_web.Models;
using toeic_web.ViewModels.Record;

namespace toeic_web.Services.IService
{
    public interface IRecordService
    {
        Task<IEnumerable<RecordViewModel>> GetRecordByUserTest(string userId, Guid testId);
        Task<IEnumerable<RecordViewModel>> GetRecordByUser(string userId);
        Task<RecordViewModel> GetRecordByID(Guid recordId);
    }
}
