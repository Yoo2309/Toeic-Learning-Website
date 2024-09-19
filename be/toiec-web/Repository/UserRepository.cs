using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class UserRepository : Repository<Users>, IUserRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public UserRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public Task<bool> AddUser(UserModel model)
        {
            try
            {
                var user = _mapper.Map<Users>(model);
                Entities.Add(user);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteUser(string userId)
        {
            var user = GetById(userId);
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }
            Entities.Remove(user);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<UserModel>> GetAllUsers()
        {
            var listData = new List<UserModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<UserModel>(item);
                listData.Add(obj);
            }
            return listData;

        }

        public async Task<UserModel> GetUserById(string userId)
        {
            IAsyncEnumerable<Users> users = Entities.AsAsyncEnumerable();
            await foreach (var user in users)
            {
                if (user.Id == userId)
                {
                    UserModel data = _mapper.Map<UserModel>(users);
                    return data;
                }
            }
            return null;
        }

        public async Task<bool> UpdateUser(UserModel model, string userId)
        {
            try
            {
                var user = _mapper.Map<Users>(model);
                user.Id = userId;
                Entities.Update(user);
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
