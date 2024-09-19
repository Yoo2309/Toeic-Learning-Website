using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Course;

namespace toeic_web.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IMapper _mapper;
        public CourseService(ICourseRepository courseRepository, IMapper mapper)
        {
            _courseRepository = courseRepository;
            _mapper = mapper;
        }
        public async Task<bool> AddCourse(CourseAddModel model)
        {
            var data = _mapper.Map<CourseModel>(model);
            return await _courseRepository.AddCourse(data);
        }

        public async Task<bool> DeleteCourse(Guid courseId)
        {
            return await _courseRepository.DeleteCourse(courseId);
        }

        public async Task<IEnumerable<CourseViewModel>> GetAllCourses()
        {
            var data = await _courseRepository.GetAllCourses();
            List<CourseViewModel> listData = new List<CourseViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<CourseViewModel>(dataItem);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<CourseViewModel> GetCourseById(Guid courseId)
        {
            var dataItem = await _courseRepository.GetCourseById(courseId);

            if (dataItem != null)
            {
                var courseViewModel = _mapper.Map<CourseViewModel>(dataItem);
                return courseViewModel;
            }

            return null;
        }

        public async Task<bool> UpdateCourse(CourseUpdateModel model, Guid courseId)
        {
            var data = _mapper.Map<CourseModel>(model);
            return await _courseRepository.UpdateCourse(data, courseId);
        }
    }
}
