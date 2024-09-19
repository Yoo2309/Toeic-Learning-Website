using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Services;
using toeic_web.Services.IService;
using toeic_web.ViewModels.TestType;
using toeic_web.ViewModels.VocTopic;

namespace toeic_web.Controllers
{
    public class TestTypeController : BaseAPIController
    {
        private readonly ITestTypeService _testTypeService;

        public TestTypeController(ITestTypeService testTypeService)
        {
            _testTypeService = testTypeService;
        }

        [HttpGet]
        [Route("GetAllTestTypes")]
        public async Task<IActionResult> GetAllTestTypes()
        {
            var listType = await _testTypeService.GetAllTestTypes();
            if (listType == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(listType);
        }

        [HttpGet]
        [Route("GetTypeNameByTest/{idTest:guid}")]
        public async Task<IActionResult> GetTypeNameByTest(Guid idTest)
        {
            var typeName = await _testTypeService.GetTypeNameByTest(idTest);
            if (typeName == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(typeName);
        }
    }
}
