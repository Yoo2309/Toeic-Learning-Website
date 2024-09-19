using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class StudentRepository : Repository<Student>, IStudentRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public StudentRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) : base (dbContext) 
        {
            _uow = uow;
            _mapper = mapper;
        }
        public Task<bool> AddStudent(StudentModel model)
        {
            try
            {
                var student = _mapper.Map<Student>(model);
                student.idStudent = Guid.NewGuid();
                Entities.Add(student);
                _uow.SaveChanges(); 
                return Task.FromResult(true);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> CheckFreeTest(string userId)
        {
            var student = await GetStudentByUserId(userId);

            return student.freeTest;
        }

        public async Task<StudentModel> GetStudentById(Guid stuId)
        {
            var student = await Entities.FirstOrDefaultAsync(stu => stu.idStudent == stuId);
            return _mapper.Map<StudentModel>(student);
        }

        public async Task<StudentModel> GetStudentByUserId(string userId)
        {
            var student = await Entities.FirstOrDefaultAsync(stu => stu.idUser == userId);
            return _mapper.Map<StudentModel>(student);
        }

        public Task<bool> UpdateStudent(StudentModel model)
        {
            try
            {
                var student = _mapper.Map<Student>(model);
                student.idStudent = model.idStudent;
                Entities.Update(student);
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
