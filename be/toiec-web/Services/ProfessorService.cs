using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;

namespace toeic_web.Services
{
    public class ProfessorService : IProfessorService
    {
        private readonly IProfessorRepository _professorRepository;

        public ProfessorService(IProfessorRepository professorRepository) 
        {
            _professorRepository = professorRepository;
        }

        public async Task<bool> AddProfessor(string userId)
        {
            var professor = new ProfessorModel
            {
                idProfessor = Guid.Empty,
                idUser = userId,
            };
            return await _professorRepository.AddProfessor(professor);
        }
    }
}
