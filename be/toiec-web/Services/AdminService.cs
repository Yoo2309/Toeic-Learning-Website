using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;

namespace toeic_web.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository) 
        {
            _adminRepository = adminRepository;
        }
        public async Task<bool> AddAdmin(string userId)
        {
            var admin = new AdminModel
            {
                idAdmin = Guid.NewGuid(),
                idUser = userId,
            };
            return await _adminRepository.AddAdmin(admin);
        }
    }
}
