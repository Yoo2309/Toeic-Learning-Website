using toeic_web.Models;
using toeic_web.ViewModels.UserAnswer;

namespace toeic_web.Repository.IRepository
{
    public interface IUserAnswerRepository
    {
        Task<IEnumerable<UserAnswerModel>> GetAllUserAnswerByStudent(string userId);
        Task<IEnumerable<UserAnswerModel>> GetUserAnswerByRecord(Guid recordId);
        Task<ScoreUserAnserModel> CalculateScore(List<UserAnswerModel> models);
        Task<string> GetPartName(UserAnswerModel model);
        Task<bool> AddUserAnswer(UserAnswerModel model, string userId);
        Task<UserAnswerResponseModel> AddListUserAnswers(IEnumerable<UserAnswerModel> models, string userId, Guid testId);
    }
}
