using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Course;
using toeic_web.ViewModels.Lesson;

namespace toeic_web.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IMapper _mapper;
        public LessonService(ILessonRepository lessonRepository, IMapper mapper) 
        {
            _lessonRepository = lessonRepository;
            _mapper = mapper;
        }
        public async Task<bool> AddLesson(LessonAddModel model)
        {
            var data = _mapper.Map<LessonModel>(model);
            return await _lessonRepository.AddLesson(data);
        }

        public async Task<bool> DeleteLesson(Guid lessonId)
        {
            return await _lessonRepository.DeleteLesson(lessonId);
        }

        public async Task<IEnumerable<LessonViewModel>> GetAllLessonByCourse(Guid courseId)
        {
            var data = await _lessonRepository.GetAllLessonByCourse(courseId);
            List<LessonViewModel> listData = new List<LessonViewModel>();
            if(data != null)
            {
                foreach(var dataItem in data)
                {
                    var obj = _mapper.Map<LessonViewModel>(dataItem);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<IEnumerable<LessonViewModel>> GetAllLessons()
        {
            var data = await _lessonRepository.GetAllLessons();
            List<LessonViewModel> listData = new List<LessonViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<LessonViewModel>(dataItem);
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<LessonViewModel> GetLessonById(Guid lessonId)
        {
            var dataItem = await _lessonRepository.GetLessonById(lessonId);
            if (dataItem != null)
            {
                var obj = _mapper.Map<LessonViewModel>(dataItem);
                return obj;
            }
            return null;
        }

        public async Task<bool> UpdateLesson(LessonUpdateModel model, Guid lessonId)
        {
            var data = _mapper.Map<LessonModel>(model);
            return await _lessonRepository.UpdateLesson(data, lessonId);
        }
    }
}
