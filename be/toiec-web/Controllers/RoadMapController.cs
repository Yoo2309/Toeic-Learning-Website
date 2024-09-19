using Microsoft.AspNetCore.Mvc;
using toeic_web.Controllers;
using toeic_web.Models;
using toeic_web.ViewModels.VocTopic;
using toiec_web.Models;
using toiec_web.Services;
using toiec_web.Services.IService;
using toiec_web.ViewModels.RoadMap;

namespace toiec_web.Controllers
{
    public class RoadMapController : BaseAPIController
    {
        private readonly IRoadMapService _roadMapService;
        public RoadMapController(IRoadMapService roadMapService)
        {
            _roadMapService = roadMapService;
        }
        [HttpGet]
        [Route("GetAllRoadMap")]
        public async Task<IActionResult> GetAllRoadMap()
        {
            var response = await _roadMapService.GetAllRoadMaps();
            if (response == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Success", Message = "Data not found." });
            }
            return Ok(response);
        }
        [HttpGet]
        [Route("GetAllRoadMapById/{idRoadMap}")]
        public async Task<IActionResult> GetAllRoadMapById(string idRoadMap)
        {
            var response = await _roadMapService.GetRoadMapById(idRoadMap);
            if (response == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Success", Message = "Data not found." });
            }
            return Ok(response);
        }
        [HttpPost]
        [Route("AddRoadMap")]
        public async Task<IActionResult> AddRoadMap(RoadMapModel model)
        {
            var response = await _roadMapService.AddRoadMap(model);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when insert data!" });
        }
        [HttpPut]
        [Route("AddCourseToRoadMap/{idRMap}/{idCourse:guid}")]
        public async Task<IActionResult> AddCourseToRoadMap(string idRMap, Guid idCourse)
        {
            var response = await _roadMapService.AddCourseToRoadMap(idRMap, idCourse);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when insert data!" });
        }
        [HttpPut]
        [Route("AddTestToRoadMap/{idRMap}/{idTest:guid}")]
        public async Task<IActionResult> AddTestToRoadMap(string idRMap, Guid idTest)
        {
            var response = await _roadMapService.AddCourseToRoadMap(idRMap, idTest);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when insert data!" });
        }
        [HttpPut]
        [Route("AddListVocToRoadMap/{idRMap}/{idList:guid}")]
        public async Task<IActionResult> AddListVocToRoadMap(string idRMap, Guid idList)
        {
            var response = await _roadMapService.AddCourseToRoadMap(idRMap, idList);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when insert data!" });
        }
        [HttpPut]
        [Route("UpdateRoadMap/{id}")]
        public async Task<IActionResult> UpdateRoadMap(RoadMapUpdateModel model, string id)
        {
            var response = await _roadMapService.UpdateRoadMap(model, id);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Updated !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when update data!" });
        }
        [HttpDelete]
        [Route("DeleteVocList/{id}")]
        public async Task<IActionResult> DeleteVocList(string id)
        {
            var response = await _roadMapService.DeleteRoadMap(id);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Deleted !" });
            }
            else
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found!" });
        }
    }
}
