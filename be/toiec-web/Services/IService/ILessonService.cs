using toeic_web.ViewModels.Lesson;

namespace toeic_web.Services.IService
{
    public interface ILessonService
    {
        Task<IEnumerable<LessonViewModel>> GetAllLessons();
        Task<LessonViewModel> GetLessonById(Guid lessonId);
        Task<IEnumerable<LessonViewModel>> GetAllLessonByCourse(Guid courseId);
        Task<bool> AddLesson(LessonAddModel model);
        Task<bool> UpdateLesson(LessonUpdateModel model, Guid lessonId);
        Task<bool> DeleteLesson(Guid lessonId);
    }
}
