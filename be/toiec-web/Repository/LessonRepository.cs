using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class LessonRepository : Repository<Lesson>, ILessonRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public LessonRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public Task<bool> AddLesson(LessonModel model)
        {
            try
            {
                var lesson = _mapper.Map<Lesson>(model);
                lesson.idLesson = Guid.NewGuid();
                Entities.Add(lesson);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteLesson(Guid lessonId)
        {
            var lesson = GetById(lessonId);
            if (lesson == null)
            {
                throw new ArgumentNullException(nameof(lesson));
            }
            Entities.Remove(lesson);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<LessonModel>> GetAllLessonByCourse(Guid courseId)
        {
            var listData = new List<LessonModel>();
            var data = await Entities.OrderBy(ls => ls.title).ToListAsync();
            foreach (var item in data)
            {
                if(item.idCourse == courseId)
                {
                    var obj = _mapper.Map<LessonModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<LessonModel>> GetAllLessons()
        {
            var listData = new List<LessonModel>();
            var data = await Entities.OrderBy(ls => ls.title).ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<LessonModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<LessonModel> GetLessonById(Guid lessonId)
        {
            IAsyncEnumerable<Lesson> lessons = Entities.AsAsyncEnumerable();
            await foreach (var lesson in lessons)
            {
                if (lesson.idLesson == lessonId)
                {
                    LessonModel data = _mapper.Map<LessonModel>(lesson);
                    return data;
                }
            }
            return null;
        }

        public Task<bool> UpdateLesson(LessonModel model, Guid lessonId)
        {
            try
            {
                var lesson = _mapper.Map<Lesson>(model);
                lesson.idLesson = lessonId;
                Entities.Update(lesson);
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
