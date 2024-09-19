using Microsoft.AspNetCore.Mvc;
using toeic_web.Controllers;
using toeic_web.Models;
using toiec_web.Services;
using toiec_web.Services.IService;
using toiec_web.ViewModels.Report;

namespace toiec_web.Controllers
{
    public class ReportController : BaseAPIController
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        [Route("GetAllReports")]
        public async Task<IActionResult> GetAllReports()
        {
            var response = await _reportService.GetAllReports();
            if (response == null)
            {
                return NotFound("Data not found");
            }
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllFalseReports/{check}")]
        public async Task<IActionResult> GetAllFalseReports(bool check)
        {
            var response = await _reportService.GetAllFalseReports(check);
            if (response == null)
            {
                return NotFound("Data not found");
            }
            return Ok(response);
        }

        [HttpPost]
        [Route("AddReport")]
        public async Task<IActionResult> AddReport(ReportAddModel model)
        {
            var response = await _reportService.AddReport(model);
            if (!response)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Fail", Message = "An issue when insert data!" });
            }
            return StatusCode(StatusCodes.Status200OK,
                new Response { Status = "Success", Message = "Added !" });
        }

        [HttpPut]
        [Route("UpdateReport")]
        public async Task<IActionResult> UpdateReport(ReportUpdateModel model, Guid idReport)
        {
            var response = await _reportService.UpdateReport(model, idReport);
            if (!response)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Fail", Message = "An issue when update data!" });
            }
            return StatusCode(StatusCodes.Status200OK,
                new Response { Status = "Success", Message = "Updated !" });
        }

        [HttpDelete]
        [Route("DeleteReport")]
        public async Task<IActionResult> DeleteReport(Guid idReport)
        {
            var response = await _reportService.DeleteReport(idReport);
            if (!response)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Fail", Message = "An issue when delete data!" });
            }
            return StatusCode(StatusCodes.Status200OK,
                new Response { Status = "Success", Message = "Deleted !" });
        }
    }
}
