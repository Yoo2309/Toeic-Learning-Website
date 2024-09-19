using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using toeic_web.Models;
using toeic_web.ViewModels.VocTopic;

namespace toeic_web.Services
{
    public class VocTopicService : IService.IVocTopicService
    {
        private readonly Repository.IRepository.IVocTopicRepository _vocTopicRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<Users> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ToeicDbContext _toeicDbContext;

        public VocTopicService(Repository.IRepository.IVocTopicRepository vocTopicRepository, IMapper mapper, UserManager<Users> userManager, 
            IConfiguration configuration, ToeicDbContext toeicDbContext)
        {
            _vocTopicRepository = vocTopicRepository;
            _mapper = mapper;
            _userManager = userManager;
            _configuration = configuration;
            _toeicDbContext = toeicDbContext;
        }
        public async Task<bool> AddVocList(VocListAddModel model, string userId)
        {
            //find author
            var user = await _userManager.FindByIdAsync(userId);
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

            var data = _mapper.Map<VocListModel>(model);
            data.idVocList = new Guid();
            data.idUser = userId;
            data.author = user.UserName;
            data.quantity = 0;
            data.createDate = timeNow;
            return await _vocTopicRepository.AddVocList(data);
        }

        public async Task<bool> DeleteVocList(Guid topicId)
        {
            return await _vocTopicRepository.DeleteVocList(topicId);
        }

        public async Task<IEnumerable<VocListViewModel>> GetAllVocList()
        {
            var data = await _vocTopicRepository.GetAllVocList();
            var listData = new List<VocListViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<VocListViewModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<VocListViewModel>> GetAllPublicVocList()
        {
            var data = await _vocTopicRepository.GetAllVocList();
            var listData = new List<VocListViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    if(item.isPublic == true)
                    {
                        var obj = _mapper.Map<VocListViewModel>(item);
                        listData.Add(obj);
                    }
                }
            }
            return listData;
        }

        public async Task<IEnumerable<VocListViewModel>> GetVocListByUser(string idUser)
        {
            var data = await _vocTopicRepository.GetVocListByUser(idUser);
            var listData = new List<VocListViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<VocListViewModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<bool> UpdateVocList(VocListUpdateModel model, Guid listId, string userId)
        {
            //find author
            var user = await _userManager.FindByIdAsync(userId);
            var vocList = await _toeicDbContext.VocList
                .Include(v => v.Vocabularies)
                .FirstOrDefaultAsync(v => v.idVocList == listId);
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);

            if(vocList == null)
            {
                return false;
            }
            var data = _mapper.Map<VocListModel>(model);
            data.idVocList = listId;
            data.idUser = userId;
            data.author = user.UserName;
            data.quantity = vocList.Vocabularies.Count;
            data.createDate = timeNow;
            return await _vocTopicRepository.UpdateVocList(data);
        }
    }
}
