using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IVipStudentRepository
    {
        Task<bool> AddVipStudent(VipStudentModel model, int duration);
        Task<bool> UpdateVipStudent(VipStudentModel model, int duration);
        Task<VipStudentModel> GetVipStudentByStudentId(string stuId);
    }
}
