using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface ILessonRepository
    {
        Task<IEnumerable<LessonModel>> GetAllLessons();
        Task<LessonModel> GetLessonById(Guid idComment);
        Task<IEnumerable<LessonModel>> GetAllLessonByCourse(Guid courseId);
        Task<bool> AddLesson(LessonModel model);
        Task<bool> UpdateLesson(LessonModel model, Guid lessonId);
        Task<bool> DeleteLesson(Guid lessonId);
    }
}
