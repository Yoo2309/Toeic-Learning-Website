using toeic_web.ViewModels.VipPackage;

namespace toeic_web.Services.IService
{
    public interface IVipPackageService
    {
        Task<IEnumerable<VipPackageViewModel>> GetAllVipPackages();
        Task<VipPackageViewModel> GetVipPackageById(string packageId);
        Task<bool> AddVipPackage(VipPackageAddModel model, string userId);
        Task<bool> UpdateVipPackage(VipPackageUpdateModel model, Guid packageId, string userId);
        Task<bool> DeleteVipPackage(Guid packageId);
    }
}
