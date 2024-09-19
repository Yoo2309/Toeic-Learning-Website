using toeic_web.Models;
using toeic_web.ViewModels.Vocabulary;

namespace toeic_web.Services.IService
{
    public interface IVocabularyService
    {
        Task<IEnumerable<VocabularyViewModel>> GetAllVocabularies();
        Task<VocabularyModel> GetVocabularyById(Guid vocId);
        Task<IEnumerable<VocabularyViewModel>> GetAllVocabularyByTopic(string topic);
        Task<IEnumerable<VocabularyViewModel>> GetAllVocabularyByList(Guid listId);
        Task<bool> AddVocFromExistList(Guid vocId, Guid idLists);
        Task<bool> AddVocabulary(VocabularyAddModel model);
        Task<bool> UpdateVocabulary(VocabularyUpdateModel model, Guid vocId);
        Task<bool> DeleteVocabulary(Guid listId, Guid vocId);
    }
}
