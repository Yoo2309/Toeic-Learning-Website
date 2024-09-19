using toeic_web.ViewModels.Quiz;

namespace toeic_web.Services.IService
{
    public interface IQuizService
    {
        Task<IEnumerable<QuizViewModel>> GetAllQuizzes();
        Task<QuizViewModel> GetQuizById(Guid quizId);
        Task<IEnumerable<QuizViewModel>> GetAllQuizByLesson(Guid lesonId);
        Task<bool> AddQuiz(QuizAddModel model);
        Task<bool> UpdateQuiz(QuizUpdateModel model, Guid quizId);
        Task<bool> DeleteQuiz(Guid quizId);
    }
}
