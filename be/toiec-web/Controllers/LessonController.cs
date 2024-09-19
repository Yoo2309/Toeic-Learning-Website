using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Lesson;
using toiec_web.ExcelRequestModels;
using toiec_web.Services.IService;

namespace toeic_web.Controllers
{
    public class LessonController : BaseAPIController
    {
        private readonly ILessonService _lessonService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ToeicDbContext _dbContext;
        private readonly IExcelHelperService _excelHelperService;

        public LessonController(ILessonService lessonService, 
            IWebHostEnvironment webHostEnvironment, 
            ToeicDbContext dbContext, IExcelHelperService excelHelperService)
        {
            _lessonService = lessonService;
            _webHostEnvironment = webHostEnvironment;
            _dbContext = dbContext;
            _excelHelperService = excelHelperService;
        }

        [HttpGet]
        [Route("GetAllLessons")]
        public async Task<IActionResult> GetAllLessons()
        {
            var lessonList = await _lessonService.GetAllLessons();
            if (lessonList == null)
            {
                return NotFound(StatusCodes.Status404NotFound);
            }
            return Ok(lessonList);
        }
        
        [HttpGet]
        [Route("GetLessonById/{id:guid}")]
        public async Task<IActionResult> GetLessonById(Guid id)
        {
            var lesson = await _lessonService.GetLessonById(id);
            if (lesson == null)
            {
                return NotFound(StatusCodes.Status404NotFound);
            }
            return Ok(lesson);
        }

        [HttpGet]
        [Route("GetAllLessonByCourse/{id:guid}")]
        public async Task<IActionResult> GetAllLessonByCourse(Guid id)
        {
            var lesson = await _lessonService.GetAllLessonByCourse(id);
            if (lesson == null)
            {
                return NotFound(StatusCodes.Status404NotFound);
            }
            return Ok(lesson);
        }

        [Authorize(Roles = "Professor")]
        [HttpPost]
        [Route("AddLesson")]
        public async Task<IActionResult> AddLesson(LessonAddModel model)
        {
            var response = await _lessonService.AddLesson(model);
            if(response == true)
            {
                return Ok(response);
            }
            else
                return BadRequest("An issue when add lesson.");
        }

        [Authorize(Roles = "Professor")]
        [HttpPut]
        [Route("UpdateLesson/{id:guid}")]
        public async Task<IActionResult> UpdateLesson([FromBody] LessonUpdateModel model, Guid id)
        {
            var response = await _lessonService.UpdateLesson(model, id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return BadRequest("An issue when update lesson.");
        }

        [Authorize(Roles = "Professor")]
        [HttpDelete]
        [Route("DeleteLesson/{id:guid}")]
        public async Task<IActionResult> DeleteLesson(Guid id)
        {
            var response = await _lessonService.DeleteLesson(id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return BadRequest("An issue when delete lesson.");
        }

        [HttpPost("upload")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> Upload(CancellationToken ct)
        {
            if (Request.Form.Files.Count == 0) return NoContent();

            var file = Request.Form.Files[0];
            var filePath = SaveFile(file);

            // load lessons requests from excel file
            var lessons = await _excelHelperService.Import<LessonRequest>(filePath);

            // save lesson requests to database
            foreach (var item in lessons)
            {   
                var lesson = new Lesson
                {
                    idLesson = new Guid(item.idLesson),
                    idCourse = new Guid(item.idCourse),
                    title = item.title,
                    content = item.content
                };
                await _dbContext.AddAsync(lesson, ct);
            }
            await _dbContext.SaveChangesAsync(ct);

            return Ok();
        }

        // save the uploaded file into ExcelData/uploads folder
        private string SaveFile(IFormFile file)
        {
            if (file.Length == 0)
            {
                throw new BadHttpRequestException("File is empty.");
            }

            var extension = Path.GetExtension(file.FileName);

            var webRootPath = _webHostEnvironment.WebRootPath;
            if (string.IsNullOrWhiteSpace(webRootPath))
            {
                webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "ExcelData");
            }

            var folderPath = Path.Combine(webRootPath, "uploads");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileName = $"{Guid.NewGuid()}.{extension}";
            var filePath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(stream);

            return filePath;
        }
    }
}
