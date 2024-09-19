using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NgrokApi;
using System.Diagnostics;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Vocabulary;
using toiec_web.ViewModels.Vocabulary;

namespace toeic_web.Controllers
{
    public class VocabularyController : BaseAPIController
    {
        private readonly IVocabularyService _vocabularyService;
        private readonly IMapper _mapper;
        private readonly ILogger<VocabularyController> _logger;
        private readonly IWebHostEnvironment _env;

        public VocabularyController(IVocabularyService vocabularyService, IMapper mapper, 
            ILogger<VocabularyController> logger, IWebHostEnvironment env)
        {
            _vocabularyService = vocabularyService;
            _mapper = mapper;
            _logger = logger;
            _env = env;
        }

        [HttpGet]
        [Route("GetAllVocabularies")]
        public async Task<IActionResult> GetAllVocabularies()
        {
            var listVoc = await _vocabularyService.GetAllVocabularies();
            if (listVoc == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found !" });
            }
            var response = new List<VocabularyViewModel>();
            foreach (var item in listVoc)
            {
                var obj = _mapper.Map<VocabularyViewModel>(item);
                if (item.image == null)
                {
                    var url = Url.Action(nameof(GetImage), "Vocabulary", new { id = item.idVoc }, Request.Scheme);
                    if (url != null && url.Contains("http://backend"))
                    {
                        url = url.Replace("http://backend", "https://toeic.workon.space");
                    }
                    obj.image = url;
                }  
                response.Add(obj);
            }
            return Ok(response);
        }

        [HttpGet]
        [Route("GetVocabularyById/{id:guid}")]
        public async Task<IActionResult> GetVocabularyById(Guid id)
        {
            var voc = await _vocabularyService.GetVocabularyById(id);
            if (voc == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found !" });
            }
            //if (voc.image == null)
            //{
            //    var url = Url.Action(nameof(GetImage), "Vocabulary", new { id = voc.idVoc }, Request.Scheme);
            //    if (url != null && url.Contains("http://backend"))
            //    {
            //        url = url.Replace("http://backend", "https://toeic.workon.space");
            //    }
            //    voc.image = url;
            //}
            return Ok(voc);
        }

        [HttpGet]
        [Route("GetVocabularyByList/{listId:guid}")]
        public async Task<IActionResult> GetAllVocabularyByList(Guid listId)
        {
            var listVoc = await _vocabularyService.GetAllVocabularyByList(listId);
            if (listVoc == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found !" });
            }

            var response = listVoc.Select(item =>
            {
                var obj = _mapper.Map<VocabularyViewModel>(item);
                if (item.image == null)
                {
                    var url = Url.Action(nameof(GetImage), "Vocabulary", new { id = item.idVoc }, Request.Scheme);
                    if (url != null && url.Contains("http://backend"))
                    {
                        url = url.Replace("http://backend", "https://toeic.workon.space");
                    }
                    obj.image = url;
                }
                return obj;
            });

            return Ok(response);
        }


        [HttpGet]
        [Route("GetVocabularyByTopic/{topic}")]
        public async Task<IActionResult> GetAllVocabularyByTopic(string topic)
        {
            var listVoc = await _vocabularyService.GetAllVocabularyByTopic(topic);
            if (listVoc == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found !" });
            }
            var response = new List<VocabularyViewModel>();
            foreach (var item in listVoc)
            {
                var obj = _mapper.Map<VocabularyViewModel>(item);
                if (item.image == null)
                {
                    var url = Url.Action(nameof(GetImage), "Vocabulary", new { id = item.idVoc }, Request.Scheme);
                    if (url != null && url.Contains("http://backend"))
                    {
                        url = url.Replace("http://backend", "https://toeic.workon.space");
                    }
                    obj.image = url;
                }
                response.Add(obj);
            }
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("AddVocabulary")]
        public async Task<IActionResult> AddVocabulary([FromForm] VocabularyAddModel model)
        {            
            var response = await _vocabularyService.AddVocabulary(model);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Failed", Message = "An issue when insert data !" });
        }

        [HttpPost]
        [Route("AddVocFromExistList")]
        public async Task<IActionResult> AddVocFromExistList(VocabularyAddExistModel model)
        {
            var response = await _vocabularyService.AddVocFromExistList(model.idVoc, model.idList);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Added !" });
            }
            return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Failed", Message = "An issue when insert data !" });
        }

        //[Authorize]
        [HttpPut]
        [Route("UpdateVocabulary/{idVoc:guid}")]
        public async Task<IActionResult> UpdateVocabulary([FromForm]VocabularyUpdateModel model, Guid idVoc)
        {
            var response = await _vocabularyService.UpdateVocabulary(model, idVoc);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Updated !" });
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Failed", Message = "An issue when update data !" });
        }

        [Authorize]
        [HttpDelete]
        [Route("DeleteVocabulary/{idList:guid}&&{idVoc:guid}")]
        public async Task<IActionResult> DeleteVocabulary(Guid idList, Guid idVoc)
        {
            var response = await _vocabularyService.DeleteVocabulary(idList, idVoc);
            if (response == true)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Deleted !" });
            }
            else
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Failed", Message = "An issue when delete data !" });
        }
        [HttpGet("GetImage/{id:guid}")]
        public async Task<IActionResult> GetImage(Guid id)
        {
            _logger.LogInformation("GetImage started");

            var stopwatch = Stopwatch.StartNew();
            var vocabulary = await _vocabularyService.GetVocabularyById(id);
            stopwatch.Stop();
            _logger.LogInformation($"GetVocabularyById took {stopwatch.ElapsedMilliseconds} ms");

            if (vocabulary == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Fail", Message = "Data not found!" });
            }

            byte[] imageBytes;
            if (string.IsNullOrEmpty(vocabulary.image))
            {
                var webRootPath = _env.WebRootPath;

                if (string.IsNullOrEmpty(webRootPath))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = "Web root path is not configured correctly." });
                }

                var defaultImagePath = Path.Combine(webRootPath, "images", "voc-default.png");

                if (!System.IO.File.Exists(defaultImagePath))
                {
                    return StatusCode(StatusCodes.Status404NotFound,
                        new Response { Status = "Fail", Message = $"Default image not found! {defaultImagePath}" });
                }
                imageBytes = await System.IO.File.ReadAllBytesAsync(defaultImagePath);
                _logger.LogInformation("Default image returned");
            }
            else
            {
                stopwatch = Stopwatch.StartNew();
                imageBytes = Convert.FromBase64String(vocabulary.image);
                stopwatch.Stop();
                _logger.LogInformation($"Base64 to byte[] conversion took {stopwatch.ElapsedMilliseconds} ms");
            }

            return File(imageBytes, "image/png");
        }

    }
}
