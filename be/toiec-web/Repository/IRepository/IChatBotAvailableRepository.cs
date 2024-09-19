using toiec_web.Models;

namespace toiec_web.Repository.IRepository
{
    public interface IChatBotAvailableRepository
    {
        Task<ChatAvailableModel> GetBotAvailableAsync(string idUser);
        Task<bool> UpdateAvailable(string idUser);
        Task<bool> AddAvailable(string idUser);
        Task<bool> ResetAvailable(string idUser);
    }
}
