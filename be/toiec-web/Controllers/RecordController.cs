using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Services;
using toeic_web.Services.IService;

namespace toeic_web.Controllers
{
    public class RecordController : BaseAPIController
    {
        private readonly IRecordService _recordService;
        private readonly IStudentService _studentService;

        public RecordController(IRecordService recordService, IStudentService studentService) 
        {
            _recordService = recordService;
            _studentService = studentService;
        }
        [Authorize]
        [HttpGet]
        [Route("GetRecordByUserTest/{userId}&&{testId:guid}")]
        public async Task<IActionResult> GetRecordByUserTest(string userId, Guid testId)
        {
            var record = await _recordService.GetRecordByUserTest(userId, testId);
            if (record == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(record);
        }
        [Authorize]
        [HttpGet]
        [Route("GetRecordByUser/{userId}")]
        public async Task<IActionResult> GetRecordByUser(string userId)
        {
            var record = await _recordService.GetRecordByUser(userId);
            if (record == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(record);
        }
        [HttpGet]
        [Route("GetRecordByID/{recordId:guid}")]
        public async Task<IActionResult> GetRecordByID(Guid recordId)
        {
            //get record
            var record = await _recordService.GetRecordByID(recordId);            
            if (record == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            //get student
            var student = await _studentService.GetStudentById(record.idStudent);
            return Ok(new
            {
                record,
                student.idUser
            });
        }
    }
}
