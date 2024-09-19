using toeic_web.Models;

namespace toeic_web.Services.IService
{
    public interface IVipStudentService
    {
        Task<bool> AddVipStudent(string studentId, int duration);
        Task<bool> UpdateVipStudent(VipStudentModel model, int duration);
        Task<VipStudentModel> GetVipStudentByStudentId(string studentId);
    }
}
