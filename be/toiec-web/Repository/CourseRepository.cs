using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class CourseRepository : Repository<Course>, ICourseRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IProfessorRepository _professorRepository;

        public CourseRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper,
            IProfessorRepository professorRepository) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _professorRepository = professorRepository;
        }

        public async Task<bool> DeleteCourse(Guid courseId)
        {
            var course = GetById(courseId);
            if (course == null)
            {
                throw new ArgumentNullException(nameof(course));
            }
            Entities.Remove(course);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<CourseModel>> GetAllCourses()
        {
            var listData = new List<CourseModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<CourseModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<CourseModel> GetCourseById(Guid courseId)
        {
            IAsyncEnumerable<Course> courses = Entities.AsAsyncEnumerable();
            await foreach (var course in courses)
            {
                if (course.idCourse == courseId)
                {
                    var data = _mapper.Map<CourseModel>(course);
                    return data;
                }
            }
            return null;
        }

        public async Task<bool> AddCourse(CourseModel model)
        {
            try
            {
                //get professor by userId
                var professor = await _professorRepository.GetProfessorByUserId(model.idUser);

                var course = _mapper.Map<Course>(model);
                course.idCourse = Guid.NewGuid();
                course.idProfessor = professor.idProfessor;
                Entities.Add(course);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> UpdateCourse(CourseModel model, Guid courseId)
        {
            try
            {
                //get professor by userId
                var professor = await _professorRepository.GetProfessorByUserId(model.idUser);

                var course = _mapper.Map<Course>(model);
                course.idCourse = courseId;
                course.idProfessor = professor.idProfessor;
                Entities.Update(course);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
