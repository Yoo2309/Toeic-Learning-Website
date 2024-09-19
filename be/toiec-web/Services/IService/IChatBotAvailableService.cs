using toiec_web.Models;

namespace toiec_web.Services.IService
{
    public interface IChatBotAvailableService
    {
        Task<ChatAvailableModel> GetBotAvailableAsync(string idUser);
        Task<bool> UpdateAvailable(string idUser);
    }
}
