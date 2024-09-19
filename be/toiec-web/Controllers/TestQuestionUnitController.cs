using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using toeic_web.Services;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Lesson;
using toeic_web.ViewModels.TestQuestionUnit;

namespace toeic_web.Controllers
{
    public class TestQuestionUnitController : BaseAPIController
    {
        private readonly ITestQuestionUnitService _testQuestionUnitService;
        private readonly IUploadFileService _uploadFileService;

        public TestQuestionUnitController(ITestQuestionUnitService testQuestionUnitService, IUploadFileService uploadFileService)
        {
            _testQuestionUnitService = testQuestionUnitService;
            _uploadFileService = uploadFileService;
        }

        [HttpGet]
        [Route("GetAllTestQuestionUnits")]
        public async Task<IActionResult> GetAllTestQuestionUnits()
        {
            var unitList = await _testQuestionUnitService.GetAllTestQuestionUnits();
            if (unitList == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(unitList);
        }

        [HttpGet]
        [Route("GetTestQuestionUnitById/{id:guid}")]
        public async Task<IActionResult> GetTestQuestionUnitById(Guid id)
        {
            var unit = await _testQuestionUnitService.GetTestQuestionUnitById(id);
            if (unit == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(unit);
        }

        [HttpGet]
        [Route("GetAllTestQuestionUnitByTest/{id:guid}")]
        public async Task<IActionResult> GetAllTestQuestionUnitByTest(Guid id)
        {
            var unit = await _testQuestionUnitService.GetAllTestQuestionUnitByTest(id);
            if (unit == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(unit);
        }

        [HttpGet]
        [Route("GetAllTestQuestionUnitByPart/{partId:guid}&&{testId:guid}")]
        public async Task<IActionResult> GetAllTestQuestionUnitByPart(Guid partId, Guid testId)
        {
            var unit = await _testQuestionUnitService.GetAllTestQuestionUnitByPart(partId, testId);
            if (unit == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(unit);
        }

        [Authorize(Roles = "Professor")]
        [HttpPost]
        [Route("AddTestQuestionUnit")]
        public async Task<IActionResult> AddTestQuestionUnit([FromForm]TestQuestionUnitAddMapModel model)
        {            
            var mapModel = new TestQuestionUnitAddModel();

            //map data
            //mapModel.idQuestionUnit = model.idQuestionUnit;
            mapModel.idTest = model.idTest;
            mapModel.idTestPart = model.idTestPart;
            mapModel.paragraph = model.paragraph;

            if(model.audio != null)
            {
                var audio = await _uploadFileService.AddAudioAsync(model.audio);
                mapModel.audio = audio.Url.ToString();
            }           
            
            if(model.image != null)
            {
                var image = await _uploadFileService.AddFileAsync(model.image);
                mapModel.image = image.Url.ToString();
            }
            
            mapModel.script = model.script;
            mapModel.translation = model.translation;

            var response = await _testQuestionUnitService.AddTestQuestionUnit(mapModel);
            if (response)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpPut]
        [Route("UpdateTestQuestionUnit/{id:guid}")]
        public async Task<IActionResult> UpdateTestQuestionUnit([FromForm] TestQuestionUnitUpdateMapModel model, Guid id)
        {
            var mapModel = new TestQuestionUnitUpdateModel();
            //map data            
            mapModel.idTest = model.idTest;
            mapModel.idTestPart = model.idTestPart;
            mapModel.paragraph = model.paragraph;
            if (model.newAudio != null)
            {
                var audio = await _uploadFileService.AddAudioAsync(model.newAudio);
                mapModel.audio = audio.Url.ToString();
            }
            if (model.oldAudio != null)
            {
                mapModel.audio = model.oldAudio;
            }

            if (model.newImage != null)
            {
                var image = await _uploadFileService.AddFileAsync(model.newImage);
                mapModel.image = image.Url.ToString();
            }
            if (model.oldImage != null)
            {
                mapModel.image = model.oldImage;
            }
            mapModel.script = model.script;
            mapModel.translation = model.translation;

            var response = await _testQuestionUnitService.UpdateTestQuestionUnit(mapModel, id);
            if (response)
            {
                return StatusCode(StatusCodes.Status200OK);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }

        [Authorize(Roles = "Professor")]
        [HttpDelete]
        [Route("DeleteTestQuestionUnit/{id:guid}")]
        public async Task<IActionResult> DeleteTestQuestionUnit(Guid id)
        {
            var response = await _testQuestionUnitService.DeleteTestQuestionUnit(id);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return StatusCode(StatusCodes.Status404NotFound);
        }
    }
}
