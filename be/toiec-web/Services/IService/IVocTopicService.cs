using toeic_web.ViewModels.VocTopic;

namespace toeic_web.Services.IService
{
    public interface IVocTopicService
    {
        Task<IEnumerable<VocListViewModel>> GetAllVocList();
        Task<IEnumerable<VocListViewModel>> GetAllPublicVocList();
        Task<IEnumerable<VocListViewModel>> GetVocListByUser(string idUser);
        Task<bool> AddVocList(VocListAddModel model, string userId);
        Task<bool> UpdateVocList(VocListUpdateModel model, Guid listId, string userId);
        Task<bool> DeleteVocList(Guid topicId);
    }
}
