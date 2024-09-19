using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class AdminRepository : Repository<Admin>, IAdminRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public AdminRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) : base (dbContext) 
        {
            _uow = uow;
            _mapper = mapper;
        }
        public Task<bool> AddAdmin(AdminModel model)
        {
            try
            {
                var admin = _mapper.Map<Admin>(model);
                admin.idAdmin = Guid.NewGuid();
                Entities.Add(admin);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<AdminModel> GetAdminByUserId(string userId)
        {
            var Admin = await Entities.FirstOrDefaultAsync(stu => stu.idUser == userId);
            return _mapper.Map<AdminModel>(Admin);
        }
    }
}
