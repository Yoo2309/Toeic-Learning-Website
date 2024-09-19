using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IQuizRepository
    {
        Task<IEnumerable<QuizModel>> GetAllQuizzes();
        Task<QuizModel> GetQuizById(Guid quizId);
        Task<IEnumerable<QuizModel>> GetAllQuizByLesson(Guid lesonId);
        Task<bool> AddQuiz(QuizModel model);
        Task<bool> UpdateQuiz(QuizModel model, Guid quizId);
        Task<bool> DeleteQuiz(Guid quizId);
    }
}
