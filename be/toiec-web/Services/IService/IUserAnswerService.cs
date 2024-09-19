using toeic_web.Models;
using toeic_web.ViewModels.UserAnswer;

namespace toeic_web.Services.IService
{
    public interface IUserAnswerService
    {
        Task<bool> AddUserAnswer(UserAnswerAddModel model, string userId);
        Task<UserAnswerResponseModel> AddListUserAnswers(IEnumerable<UserAnswerModel> models, string userId, Guid testId);
        Task<IEnumerable<UserAnswerViewModel>> GetUserAnswerByRecord(Guid recordId);
    }
}
