using System.ComponentModel.DataAnnotations;

namespace toeic_web.ViewModels.Authentication
{
    public class ResetPasswordModel
    {
        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }
        [Required]
        public string? OTP { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? NewPassword { get; set; }
    }
}
