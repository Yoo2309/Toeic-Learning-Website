using toeic_web.Models;
using toeic_web.ViewModels.DoTest;
using toeic_web.ViewModels.Question;

namespace toeic_web.Services.IService
{
    public interface IQuestionService
    {
        Task<IEnumerable<QuestionViewModel>> GetAllQuestions();
        Task<QuestionViewModel> GetQuestionById(Guid questionId);
        Task<IEnumerable<QuestionViewModel>> GetAllQuestionByQuiz(Guid quizId);
        Task<IEnumerable<QuestionViewModel>> GetAllQuestionByUnit(Guid unitId);
        Task<IEnumerable<QuestionViewModel>> GetAllQuestionByProfessor(string userId);
        Task<DoTestViewModel> GetDoTest(Guid testId);
        Task<bool> AddQuestion(QuestionAddModel model, string userId);
        Task<bool> UpdateQuestion(QuestionUpdateModel model, Guid questionId, string userId);
        Task<bool> DeleteQuestion(Guid questionId);
    }
}
