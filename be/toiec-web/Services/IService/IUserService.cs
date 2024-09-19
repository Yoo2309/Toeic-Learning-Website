using toeic_web.Models;
using toeic_web.ViewModels.User;

namespace toeic_web.Services.IService
{
    public interface IUserService
    {
        Task<IEnumerable<UserViewModel>> GetAllUsers();
        Task<UserModel> GetUserById(string userId);
        Task<bool> AddUser(UserViewModel model);
        Task<bool> UpdateUser(UserViewModel model, string userId);
        Task<bool> DeleteUser(string userId);
    }
}
