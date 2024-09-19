using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Services;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Test;
using toeic_web.ViewModels.Vocabulary;

namespace toeic_web.Controllers
{
    public class TestController : BaseAPIController
    {
        private readonly ITestService _testService;

        public TestController(ITestService testService) 
        {
            _testService = testService;
        }

        [HttpGet]
        [Route("GetAllTests")]
        public async Task<IActionResult> GetAllTests()
        {
            var listTest = await _testService.GetAllTests();
            if (listTest == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(listTest);
        }

        [HttpGet]
        [Route("GetTestById/{id:guid}")]
        public async Task<IActionResult> GetTestById(Guid id)
        {
            var test = await _testService.GetTestById(id);
            if (test == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(test);
        }

        [HttpGet]
        [Route("GetAllTestByProfessor/{userId}")]
        public async Task<IActionResult> GetAllTestByProfessor(string userId)
        {
            var test = await _testService.GetAllTestByProfessor(userId);
            if (test == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(test);
        }

        [HttpGet]
        [Route("GetAllTestByType/{typeName}")]
        public async Task<IActionResult> GetAllTestByType(string typeName)
        {
            var test = await _testService.GetAllTestByType(typeName);
            if (test == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(test);
        }

        [Authorize(Roles = "Professor")]
        [HttpPost]
        [Route("AddTest")]
        public async Task<IActionResult> AddTest(TestAddModel model, string userId)
        {
            var response = await _testService.AddTest(model, userId);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpPut]
        [Route("UpdateTest/{testId:guid}&&{userId}")]
        public async Task<IActionResult> UpdateTest(TestUpdateModel model, Guid testId, string userId)
        {
            var response = await _testService.UpdateTest(model, testId, userId);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpDelete]
        [Route("DeleteTest/{id:guid}")]
        public async Task<IActionResult> DeleteTest(Guid id)
        {
            var response = await _testService.DeleteTest(id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status404NotFound);
        }
    }
}
