using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Course;

namespace toeic_web.Controllers
{
    
    public class CourseController : BaseAPIController
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService; 
        }
        
        [HttpGet]
        [Route("GetAllCourses")]
        public async Task<IActionResult> GetAllCourses()
        {
            var courseList = await _courseService.GetAllCourses();
            if (courseList == null)
            {
                return Ok("No data!");
            }
            return Ok(courseList);
        }

        [HttpGet]
        [Route("GetCourseById/{id:guid}")]
        public async Task<IActionResult> GetCourseById(Guid id)
        {
            var course = await _courseService.GetCourseById(id);
            if (course == null)
            {
                return Ok("No data!");
            }
            return Ok(course);
        }

        [Authorize(Roles = "Professor")]
        [HttpPost]
        [Route("AddCourse")]
        public async Task<IActionResult> AddCourse(CourseAddModel model)
        {
            var response = await _courseService.AddCourse(model);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpPut]
        [Route("UpdateCourse/{id:guid}")]
        public async Task<IActionResult> UpdateCourse([FromBody]CourseUpdateModel model, Guid id)
        {
            var response = await _courseService.UpdateCourse(model, id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpDelete]
        [Route("DeleteCourse/{id:guid}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var response = await _courseService.DeleteCourse(id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status404NotFound);
        }
    }
}
