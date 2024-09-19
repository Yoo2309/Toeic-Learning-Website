using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IAdminRepository
    {
        Task<bool> AddAdmin(AdminModel model);
        Task<AdminModel> GetAdminByUserId(string userId);
    }
}
