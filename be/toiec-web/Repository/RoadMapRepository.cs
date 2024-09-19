using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toiec_web.Data;
using toiec_web.Models;
using toiec_web.Repository.IRepository;

namespace toiec_web.Repository
{
    public class RoadMapRepository : Repository<RoadMap>, IRoadMapRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public RoadMapRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public Task<bool> AddRoadMap(RoadMapModel model)
        {
            try
            {
                var rmap = _mapper.Map<RoadMap>(model);
                Entities.Add(rmap);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteRoadMap(string roadMapId)
        {
            var rmap = GetById(roadMapId);
            if (rmap == null)
            {
                throw new ArgumentNullException(nameof(rmap));
            }
            Entities.Remove(rmap);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<RoadMapModel>> GetAllRoadMaps()
        {
            var listData = new List<RoadMapModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<RoadMapModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public Task<RoadMapModel> GetRoadMapById(string roadMapId)
        {
            var data = GetById(roadMapId);
            if (data == null)
            {
                return Task.FromResult<RoadMapModel>(null);
            }
            var rmap = _mapper.Map<RoadMapModel>(data);
            return Task.FromResult(rmap);
        }

        public Task<bool> UpdateRoadMap(RoadMapModel model)
        {
            try
            {
                var rmap = _mapper.Map<RoadMap>(model);
                rmap.Id = model.Id;
                Entities.Update(rmap);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
