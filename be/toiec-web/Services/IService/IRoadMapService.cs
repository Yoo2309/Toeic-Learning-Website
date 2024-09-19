using toiec_web.Models;
using toiec_web.ViewModels.RoadMap;

namespace toiec_web.Services.IService
{
    public interface IRoadMapService
    {
        Task<IEnumerable<RoadMapModel>> GetAllRoadMaps();
        Task<RoadMapModel> GetRoadMapById(string roadMapId);
        Task<bool> AddRoadMap(RoadMapModel model);
        Task<bool> UpdateRoadMap(RoadMapUpdateModel model, string id);
        Task<bool> DeleteRoadMap(string roadMapId);
        Task<bool> AddCourseToRoadMap(string idRoadMap, Guid idCourse);
        Task<bool> AddTestToRoadMap(string idRoadMap, Guid idTest);
        Task<bool> AddListVocToRoadMap(string idRoadMap, Guid idListVoc);
    }
}
