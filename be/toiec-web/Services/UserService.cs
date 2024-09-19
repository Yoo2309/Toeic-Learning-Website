using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.User;

namespace toeic_web.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper) 
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<bool> AddUser(UserViewModel model)
        {
            var data = _mapper.Map<UserModel>(model);
            return await _userRepository.AddUser(data);
        }

        public async Task<bool> DeleteUser(string userId)
        {
            return await _userRepository.DeleteUser(userId);
        }

        public async Task<IEnumerable<UserViewModel>> GetAllUsers()
        {
            var data = await _userRepository.GetAllUsers();
            List<UserViewModel> listUser = new List<UserViewModel>();   
            if (data != null)
            {
                foreach (var user in data)
                {
                    var obj = _mapper.Map<UserViewModel>(user);
                    listUser.Add(obj);
                }
                return listUser;
            }
            return null;
        }

        public async Task<UserModel> GetUserById(string userId)
        {
            var data = await _userRepository.GetUserById(userId);
            if (data != null)
            {
                var obj = _mapper.Map<UserModel>(data);
                return obj;
            }
            return null;
        }

        public async Task<bool> UpdateUser(UserViewModel model, string userId)
        {
            var data = _mapper.Map<UserModel>(model);
            return await _userRepository.UpdateUser(data, userId);
        }
    }
}
