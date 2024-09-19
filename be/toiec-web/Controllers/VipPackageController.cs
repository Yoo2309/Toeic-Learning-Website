using Microsoft.AspNetCore.Mvc;
using toeic_web.Services.IService;
using toeic_web.ViewModels.VipPackage;

namespace toeic_web.Controllers
{
    public class VipPackageController : BaseAPIController
    {
        private readonly IVipPackageService _vipPackageService;

        public VipPackageController(IVipPackageService vipPackageService) 
        {
            _vipPackageService = vipPackageService;
        }

        [HttpGet]
        [Route("GetAllVipPackages")]
        public async Task<IActionResult> GetAllVipPackages()
        {
            var listpackage = await _vipPackageService.GetAllVipPackages();
            if (listpackage == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(listpackage);
        }

        [HttpGet]
        [Route("GetVipPackageById/{id:guid}")]
        public async Task<IActionResult> GetVipPackageById(Guid id)
        {
            var package = await _vipPackageService.GetVipPackageById(id.ToString());
            if (package == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            return Ok(package);
        }
    }
}
