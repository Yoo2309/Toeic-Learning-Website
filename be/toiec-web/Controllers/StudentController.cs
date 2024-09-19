using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Services;
using toeic_web.Services.IService;

namespace toeic_web.Controllers
{
    [Authorize]
    public class StudentController : BaseAPIController
    {
        private readonly IStudentService _studentService;
        public StudentController(IStudentService studentService) 
        {
            _studentService = studentService;
        }
        [HttpGet]
        [Route("CheckFreeTest/{userId}")]
        public async Task<IActionResult> CheckFreeTest(string userId)
        {
            var freeTest = await _studentService.CheckFreeTest(userId);
            return Ok(freeTest);
        }
    }
}
