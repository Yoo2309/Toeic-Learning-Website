using toiec_web.Models;
using toiec_web.Repository.IRepository;
using toiec_web.Services.IService;

namespace toiec_web.Services
{
    public class ChatBotAvailableService : IChatBotAvailableService
    {
        private readonly IChatBotAvailableRepository _chatBotAvailableRepository;
        public ChatBotAvailableService(IChatBotAvailableRepository chatBotAvailableRepository)
        {
            _chatBotAvailableRepository = chatBotAvailableRepository;
        }
        public async Task<ChatAvailableModel> GetBotAvailableAsync(string idUser)
        {
            var response = await _chatBotAvailableRepository.GetBotAvailableAsync(idUser);
            if (response != null)
            {
                return response;
            }
            return null;
        }

        public async Task<bool> UpdateAvailable(string idUser)
        {
            return await _chatBotAvailableRepository.UpdateAvailable(idUser);
        }
    }
}
