using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Models;
using toeic_web.Services;
using toeic_web.Services.IService;
using toeic_web.ViewModels.UserAnswer;
using toeic_web.ViewModels.Vocabulary;

namespace toeic_web.Controllers
{
    [Authorize]
    public class UserAnswerController : BaseAPIController
    {
        private readonly IUserAnswerService _userAnswerService;

        public UserAnswerController(IUserAnswerService userAnswerService) 
        {
            _userAnswerService = userAnswerService;
        }

        [HttpPost]
        [Route("AddListUserAnswers/{userId}&&{testId}")]
        public async Task<IActionResult> AddListUserAnswers(IEnumerable<UserAnswerModel> models, string userId, Guid testId)
        {
            var response = await _userAnswerService.AddListUserAnswers(models, userId, testId);
            if (response != null)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);            
        }

        [HttpGet]
        [Route("GetUserAnswerByRecord/{recordId}")]
        public async Task<IActionResult> GetUserAnswerByRecord(Guid recordId)
        {
            var answer = await _userAnswerService.GetUserAnswerByRecord(recordId);
            if (answer == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(answer);
        }
    }
}
