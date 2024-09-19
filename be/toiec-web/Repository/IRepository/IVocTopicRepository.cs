using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IVocTopicRepository
    {
        Task<IEnumerable<VocListModel>> GetAllVocList();
        Task<IEnumerable<VocListModel>> GetVocListByUser(string idUser);
        Task<VocListModel> GetVocListId(Guid idList);
        Task<bool> AddVocList(VocListModel model);
        Task<bool> UpdateVocList(VocListModel model);
        Task<bool> DeleteVocList(Guid topicId);
    }
}
