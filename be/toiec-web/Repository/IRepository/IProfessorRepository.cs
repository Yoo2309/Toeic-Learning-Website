using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IProfessorRepository
    {
        Task<bool> AddProfessor(ProfessorModel model);
        Task<ProfessorModel> GetProfessorByUserId(string  userId);
    }
}
