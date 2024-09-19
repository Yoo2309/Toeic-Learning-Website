using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toiec_web.Data;
using toiec_web.Models;

namespace toeic_web.Repository
{
    public class VocTopicRepository : Repository<VocList>, IVocTopicRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public VocTopicRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<bool> AddVocList(VocListModel model)
        {
            try
            {
                var topic = _mapper.Map<VocList>(model);
                topic.idVocList = Guid.NewGuid();
                Entities.Add(topic);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {   
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteVocList(Guid topicId)
        {
            var topic = GetById(topicId);
            if (topic == null)
            {
                return await Task.FromResult(false);
            }
            Entities.Remove(topic);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateVocList(VocListModel model)
        {
            try
            {
                var topic = _mapper.Map<VocList>(model);
                Entities.Update(topic);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<IEnumerable<VocListModel>> GetAllVocList()
        {
            var listData = new List<VocListModel>();
            var data = await Entities.OrderBy(item => item.title).ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<VocListModel>(item);
                listData.Add(obj);
            }
            return listData;

        }

        public async Task<IEnumerable<VocListModel>> GetVocListByUser(string idUser)
        {
            var listData = new List<VocListModel>();
            var data = await Entities.OrderBy(item => item.title).ToListAsync();
            foreach (var item in data)
            {
                if (item.idUser == idUser)
                {
                    var obj = _mapper.Map<VocListModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public Task<VocListModel> GetVocListId(Guid idList)
        {
            var data = GetById(idList);
            if (data == null)
            {
                return Task.FromResult<VocListModel>(null);
            }
            var vocList = _mapper.Map<VocListModel>(data);
            return Task.FromResult(vocList);
        }
    }
}
