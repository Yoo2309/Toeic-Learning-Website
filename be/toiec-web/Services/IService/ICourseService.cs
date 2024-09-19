using toeic_web.Models;
using toeic_web.ViewModels.Course;

namespace toeic_web.Services.IService
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseViewModel>> GetAllCourses();
        Task<CourseViewModel> GetCourseById(Guid courseId);
        Task<bool> AddCourse(CourseAddModel model);
        Task<bool> UpdateCourse(CourseUpdateModel model, Guid courseId);
        Task<bool> DeleteCourse(Guid courseId);
    }
}
