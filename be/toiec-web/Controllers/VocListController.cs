using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.VocTopic;
using toiec_web.Services;
using toiec_web.Services.IService;

namespace toeic_web.Controllers
{
    public class VocListController : BaseAPIController
    {
        private readonly IVocTopicService _vocTopicService;
        private readonly ToeicDbContext _dbContext;
        private readonly IExcelHelperService _excelHelper;

        public VocListController(IVocTopicService vocTopicService, ToeicDbContext dbContext,
            IExcelHelperService excelHelper) 
        {
            _vocTopicService = vocTopicService;
            _dbContext = dbContext;
            _excelHelper = excelHelper;
        }

        [HttpGet]
        [Route("GetAllPublicVocList")]
        public async Task<IActionResult> GetAllVocTopic()
        {
            var listTopic = await _vocTopicService.GetAllPublicVocList();
            if (listTopic == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found." });
            }
            return Ok(listTopic);
        }

        [HttpGet]
        [Route("GetVocListByUser/{idUser}")]
        public async Task<IActionResult> GetVocListByUser(string idUser)
        {
            var topic = await _vocTopicService.GetVocListByUser(idUser);
            if (topic == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found." });
            }
            return Ok(topic);
        }

        [HttpGet]
        [Route("GetVocListById/{idList:guid}")]
        public async Task<IActionResult> GetVocListById(Guid idList)
        {
            var topic = await _vocTopicService.GetAllVocList();
            if (topic != null)
            {
                foreach (var item in topic)
                {
                    if (item.idVocList == idList)
                    {
                        return Ok(item);
                    }
                }
            }            
            return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found." });
        }
        //[Authorize]
        [HttpPost]
        [Route("AddVocList")]
        public async Task<IActionResult> AddVocList(VocListAddModel model, string userId)
        {
            var response = await _vocTopicService.AddVocList(model, userId);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when insert data!" });
        }

        //[Authorize]
        [HttpPut]
        [Route("UpdateVocList/{idList:guid}&&{userId}")]
        public async Task<IActionResult> UpdateVocTopic(VocListUpdateModel model, Guid idList, string userId)
        {
            var response = await _vocTopicService.UpdateVocList(model, idList, userId);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Updated !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Fail", Message = "An issue when update data!" });
        }

        //[Authorize]
        [HttpDelete]
        [Route("DeleteVocList/{id:guid}")]
        public async Task<IActionResult> DeleteVocList(Guid id)
        {
            var response = await _vocTopicService.DeleteVocList(id);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Deleted !" });
            }
            else
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found!" });
        }

        [HttpGet("download")]
        public async Task<FileResult> Download(CancellationToken ct)
        {
            var topics = await _dbContext.VocList.ToListAsync(ct);
            var file = await _excelHelper.CreateFile(topics);
            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "vocTopics.xlsx");
        }
    }
}
