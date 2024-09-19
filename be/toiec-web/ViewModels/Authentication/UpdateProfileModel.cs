using System.ComponentModel.DataAnnotations;

namespace toeic_web.ViewModels.Authentication
{
    public class UpdateProfileModel
    {
        public string? FullName { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public string? DateOfBirth { get; set; }
        public bool Gender { get; set; }
        public string PhoneNumber { get; set; }
        public bool Enable2FA { get; set; }
        public IFormFile? NewImage { get; set; }
        public string? OldImage { get; set; }
    }
}
