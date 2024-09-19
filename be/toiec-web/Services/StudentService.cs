using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;

namespace toeic_web.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IMapper _mapper;

        public StudentService(IStudentRepository studentRepository ,IMapper mapper) 
        {
            _studentRepository = studentRepository;
            _mapper = mapper;
        }
        public async Task<bool> AddStudent(string userId)
        {
            var student = new StudentModel
            {
                idStudent = Guid.Empty,
                idUser = userId,
                freeTest = true,
            };
            return await _studentRepository.AddStudent(student);
        }

        public async Task<bool> CheckFreeTest(string userId)
        {
            return await _studentRepository.CheckFreeTest(userId);
        }

        public Task<StudentModel> GetStudentById(Guid stuId)
        {
            return _studentRepository.GetStudentById(stuId);
        }

        public Task<StudentModel> GetStudentByUserId(string userId)
        {
            return _studentRepository.GetStudentByUserId(userId);
        }
    }
}
