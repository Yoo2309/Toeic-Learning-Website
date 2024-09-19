using System.ComponentModel.DataAnnotations;

namespace toeic_web.ViewModels.User
{
    public class UserViewModel
    {
        public string id { get; set; }
        public string fullname { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public string dateOfBirth { get; set; }
        public bool gender { get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string phonenumber { get; set; }
        public string imageURL { get; set; }
        public List<string> roles { get; set; }
    }
}
