using toeic_web.Models;
using toiec_web.Models;

namespace toiec_web.Repository.IRepository
{
    public interface IRoadMapRepository
    {
        Task<IEnumerable<RoadMapModel>> GetAllRoadMaps();
        Task<RoadMapModel> GetRoadMapById(string roadMapId);
        Task<bool> AddRoadMap(RoadMapModel model);
        Task<bool> UpdateRoadMap(RoadMapModel model);
        Task<bool> DeleteRoadMap(string roadMapId);
    }
}
