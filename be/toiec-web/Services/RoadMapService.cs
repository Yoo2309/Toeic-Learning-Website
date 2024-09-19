using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.ViewModels.Course;
using toiec_web.Models;
using toiec_web.Repository.IRepository;
using toiec_web.Services.IService;
using toiec_web.ViewModels.RoadMap;

namespace toiec_web.Services
{
    public class RoadMapService : IRoadMapService
    {
        private readonly IMapper _mapper;
        private readonly IRoadMapRepository _roadMapRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly ITestRepository _testRepository;
        private readonly IVocTopicRepository _vocTopicRepository;
        public RoadMapService(IRoadMapRepository roadMapRepository, IMapper mapper, 
            IVocTopicRepository vocTopicRepository, ITestRepository testRepository, ICourseRepository courseRepository)
        {
            _roadMapRepository = roadMapRepository;
            _mapper = mapper;
            _vocTopicRepository = vocTopicRepository;
            _testRepository = testRepository;
            _courseRepository = courseRepository;
        }

        public async Task<bool> AddCourseToRoadMap(string idRoadMap, Guid idCourse)
        {
            //get course
            var courseData = await _courseRepository.GetCourseById(idCourse);

            if (courseData == null)
            {
                return false;
            }
            var courseAdd = _mapper.Map<CourseModel>(courseData);
            courseAdd.idRoadMap = idRoadMap;
            courseAdd.idUser = "0eaf6926-d068-49a3-a42e-ce446d603178";
            return await _courseRepository.UpdateCourse(courseAdd, idCourse);
        }

        public async Task<bool> AddListVocToRoadMap(string idRoadMap, Guid idListVoc)
        {
            //get ListVoc
            var listVocData = await _vocTopicRepository.GetVocListId(idListVoc);

            if (listVocData == null)
            {
                return false;
            }
            var listAdd = _mapper.Map<VocListModel>(listVocData);
            listAdd.idRoadMap = idRoadMap;
            return await _vocTopicRepository.UpdateVocList(listAdd);
        }

        public async Task<bool> AddRoadMap(RoadMapModel model)
        {
            return await _roadMapRepository.AddRoadMap(model);
        }

        public async Task<bool> AddTestToRoadMap(string idRoadMap, Guid idTest)
        {
            //get test
            var testData = await _testRepository.GetTestById(idTest);
            if (testData == null)
            {
                return false;
            }
            var testAdd = _mapper.Map<TestModel>(testData);
            testAdd.idRoadMap = idRoadMap;
            return await _testRepository.UpdateTest(testAdd, idTest, "0eaf6926-d068-49a3-a42e-ce446d603178");
        }

        public async Task<bool> DeleteRoadMap(string roadMapId)
        {
            return await _roadMapRepository.DeleteRoadMap(roadMapId);
        }

        public async Task<IEnumerable<RoadMapModel>> GetAllRoadMaps()
        {
            return await _roadMapRepository.GetAllRoadMaps();
        }

        public async Task<RoadMapModel> GetRoadMapById(string roadMapId)
        {
            return await _roadMapRepository.GetRoadMapById(roadMapId);
        }

        public Task<bool> UpdateRoadMap(RoadMapUpdateModel model, string id)
        {
            var data = _mapper.Map<RoadMapModel>(model);
            data.Id = id;
            return _roadMapRepository.UpdateRoadMap(data);
        }
    }
}
