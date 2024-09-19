using toeic_web.Models;

namespace toeic_web.Services.IService
{
    public interface IStudentService
    {
        Task<bool> AddStudent(string userId);
        Task<bool> CheckFreeTest(string userId);
        Task<StudentModel> GetStudentById(Guid stuId);
        Task<StudentModel> GetStudentByUserId(string userId);
    }
}
