using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.VipPackage;
using toeic_web.ViewModels.VocTopic;

namespace toeic_web.Services
{
    public class VipPackageService : IVipPackageService
    {
        private readonly IVipPackageRepository _vipPackageRepository;
        private readonly IMapper _mapper;

        public VipPackageService(IVipPackageRepository vipPackageRepository, IMapper mapper)
        {
            _vipPackageRepository = vipPackageRepository;
            _mapper = mapper;
        }
        public async Task<bool> AddVipPackage(VipPackageAddModel model, string userId)
        {
            var data = _mapper.Map<VipPackageModel>(model);
            return await _vipPackageRepository.AddVipPackage(data, userId);
        }

        public async Task<bool> DeleteVipPackage(Guid packageId)
        {
            return await _vipPackageRepository.DeleteVipPackage(packageId);
        }

        public async Task<IEnumerable<VipPackageViewModel>> GetAllVipPackages()
        {
            var data = await _vipPackageRepository.GetAllVipPackages();
            List<VipPackageViewModel> listData = new List<VipPackageViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<VipPackageViewModel>(item);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<VipPackageViewModel> GetVipPackageById(string packageId)
        {
            var data = await _vipPackageRepository.GetVipPackageById(Guid.Parse(packageId));
            if (data != null)
            {
                var obj = _mapper.Map<VipPackageViewModel>(data);
                return obj;
            }
            return null;
        }

        public async Task<bool> UpdateVipPackage(VipPackageUpdateModel model, Guid packageId, string userId)
        {
            var data = _mapper.Map<VipPackageModel>(model);
            return await _vipPackageRepository.UpdateVipPackage(data, packageId, userId);
        }
    }
}
