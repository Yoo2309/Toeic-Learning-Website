using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toiec_web.Data;
using toiec_web.Models;
using toiec_web.Repository.IRepository;

namespace toiec_web.Repository
{
    public class ChatBotAvailableRepository : Repository<UserChatBot>, IChatBotAvailableRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly UserManager<Users> _userManager;
        public ChatBotAvailableRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper,
            UserManager<Users> userManager) : base (dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _userManager = userManager;
        }

        public Task<bool> AddAvailable(string idUser)
        {
            if (idUser == null) { throw new ArgumentNullException ("id"); }
            
            var newChatAvailable = new ChatAvailableModel
            {
                idUser = idUser,
                availableChat = 10, // Assuming a default value for availableChat
                lastReset = DateTime.UtcNow // Assuming current time for last reset
            };

            var userChatBot = _mapper.Map<UserChatBot>(newChatAvailable);
            // Save the new user to the database
            Entities.Add(userChatBot);
            _uow.SaveChanges();
            return Task.FromResult(true);
        }

        public async Task<ChatAvailableModel> GetBotAvailableAsync(string idUser)
        {
            var user = await _userManager.FindByIdAsync(idUser);
            if (user == null)
            {
                throw new Exception("User doesn't exist.");
            }
            var available = await Entities.FirstOrDefaultAsync(avail => avail.idUser == idUser);
            if (available == null)
            {
                var add = await AddAvailable(idUser);
                if (!add) throw new Exception("An issue when add available.");
            }
            var resetAvail = await ResetAvailable(idUser);
            if (!resetAvail)
            {
                throw new Exception("An issue when reset available.");
            }
            var availReady = GetById(idUser);
            var response = _mapper.Map<ChatAvailableModel>(availReady);
            return response;
        }

        public Task<bool> ResetAvailable(string idUser)
        {
            var userChatBot = GetById(idUser);
            if (userChatBot != null)
            {
                // Check if a new month has started
                var now = DateTime.UtcNow;
                if (userChatBot.lastReset.Month != now.Month || userChatBot.lastReset.Year != now.Year)
                {
                    // Reset availableChat if it's a new month
                    userChatBot.availableChat = 10;
                    userChatBot.lastReset = now;
                }
                // Update the user in the database
                Entities.Update(userChatBot);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public async Task<bool> UpdateAvailable(string idUser)
        {
            // Check if the user exists
            var existingUser = GetById(idUser);
            if (existingUser != null)
            {
                await ResetAvailable(idUser);
                var response = GetById(idUser);
                // User exists, update availableChat if it's between 1 and 10
                if (response.availableChat > 0 && response.availableChat <= 10)
                {
                    response.availableChat -= 1;
                    // Update the user in the database
                    Entities.Update(response);
                    _uow.SaveChanges();
                    return true;
                }
            }                  
            return false;
        }
    }
}
