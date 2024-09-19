using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Infrastructure;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace toeic_web.Repository
{
    public class VipPackageRepository : Repository<VipPackage>, IVipPackageRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IAdminRepository _adminRepository;

        public VipPackageRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper, IAdminRepository adminRepository
            ) : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _adminRepository = adminRepository;
        }
        public async Task<bool> AddVipPackage(VipPackageModel model, string userId)
        {
            try
            {
                var vipPackage = _mapper.Map<VipPackage>(model);
                var admin = await _adminRepository.GetAdminByUserId(userId);
                vipPackage.idPackage = Guid.NewGuid();
                vipPackage.idAdmin = admin.idAdmin;
                Entities.Add(vipPackage);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteVipPackage(Guid idPackage)
        {
            var vipPackage = GetById(idPackage);
            if (vipPackage == null)
            {
                throw new ArgumentNullException(nameof(vipPackage));
            }
            Entities.Remove(vipPackage);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<VipPackageModel>> GetAllVipPackages()
        {
            var listData = new List<VipPackageModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<VipPackageModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<VipPackageModel> GetVipPackageById(Guid idPackage)
        {
            IAsyncEnumerable<VipPackage> vipPackages = Entities.AsAsyncEnumerable();
            await foreach (var vipPackage in vipPackages)
            {
                if (vipPackage.idPackage == idPackage)
                {
                    VipPackageModel data = _mapper.Map<VipPackageModel>(vipPackage);
                    return data;
                }
            }
            return null;
        }

        public async Task<bool> UpdateVipPackage(VipPackageModel model, Guid idPackage, string userId)
        {
            try
            {
                var vipPackage = _mapper.Map<VipPackage>(model);
                var admin = await _adminRepository.GetAdminByUserId(userId);
                vipPackage.idPackage = idPackage;
                vipPackage.idAdmin = admin.idAdmin;
                Entities.Update(vipPackage);
                _uow.SaveChanges();
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
