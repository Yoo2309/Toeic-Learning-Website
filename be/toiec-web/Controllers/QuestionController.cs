using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using toeic_web.Services;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Course;
using toeic_web.ViewModels.Question;

namespace toeic_web.Controllers
{
    public class QuestionController : BaseAPIController
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService) 
        {
            _questionService = questionService;
        }
        [HttpGet]
        [Route("GetAllQuestions")]
        public async Task<IActionResult> GetAllQuestions()
        {
            var questionList = await _questionService.GetAllQuestions();
            if (questionList == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(questionList);
        }

        [HttpGet]
        [Route("GetQuestionById/{id:guid}")]
        public async Task<IActionResult> GetQuestionById(Guid id)
        {
            var question = await _questionService.GetQuestionById(id);
            if (question == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(question);
        }

        [HttpGet]
        [Route("GetAllQuestionByQuiz/{quizId}")]
        public async Task<IActionResult> GetAllQuestionByQuiz(Guid quizId)
        {
            var questionList = await _questionService.GetAllQuestionByQuiz(quizId);
            if (questionList == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(questionList);
        }

        [HttpGet]
        [Route("GetAllQuestionByUnit/{unitId}")]
        public async Task<IActionResult> GetAllQuestionByUnit(Guid unitId)
        {
            var questionList = await _questionService.GetAllQuestionByUnit(unitId);
            if (questionList == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(questionList);
        }

        [HttpGet]
        [Route("GetAllQuestionByProfessor/{userId}")]
        public async Task<IActionResult> GetAllQuestionByProfessor(string userId)
        {
            var questionList = await _questionService.GetAllQuestionByProfessor(userId);
            if (questionList == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(questionList);
        }

        [HttpGet]
        [Route("GetDoTest/{testId}")]
        public async Task<IActionResult> GetAllQuestionByProfessor(Guid testId)
        {
            var doTest = await _questionService.GetDoTest(testId);
            if (doTest == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(doTest);
        }

        [Authorize(Roles = "Professor")]
        [HttpPost]
        [Route("AddQuestion/{userId}")]
        public async Task<IActionResult> AddQuestion(QuestionAddModel model, string userId)
        {
            var response = await _questionService.AddQuestion(model, userId);            

            if (response)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpPut]
        [Route("UpdateQuestion/{questionId:guid}&&{userId}")]
        public async Task<IActionResult> UpdateQuestion([FromBody] QuestionUpdateModel model, Guid questionId, string userId)
        {
            var response = await _questionService.UpdateQuestion(model, questionId, userId);
            if (response)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpDelete]
        [Route("DeleteQuestion/{id:guid}")]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            var response = await _questionService.DeleteQuestion(id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status404NotFound);
        }
    }
}
