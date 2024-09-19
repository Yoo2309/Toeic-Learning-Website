using Microsoft.AspNetCore.Mvc;
using toeic_web.Controllers;
using toiec_web.Data;
using toiec_web.Services.IService;

namespace toiec_web.Controllers
{
    public class ChatBotController : BaseAPIController
    {
        private readonly IChatBotAvailableService _chatBotAvailableService;
        public ChatBotController(IChatBotAvailableService chatBotAvailableService)
        {
            _chatBotAvailableService = chatBotAvailableService;
        }   

        [HttpGet]
        [Route("GetAvailable/{idUser}")]
        public async Task<IActionResult> GetAvailableChat(string idUser)
        {
            var response = await _chatBotAvailableService.GetBotAvailableAsync(idUser);
            if(response == null)
            {
                return NotFound("Data not found.");
            }
            return Ok(response);
        }
        [HttpPut]
        [Route("UpdateAvalableChat/{idUser}")]
        public async Task<IActionResult> UpdateAvalableChat(string idUser)
        {
            var response = await _chatBotAvailableService.UpdateAvailable(idUser);
            if (response == false)
            {
                return NotFound("Data not found.");
            }
            return Ok(response);
        }
    }
}
