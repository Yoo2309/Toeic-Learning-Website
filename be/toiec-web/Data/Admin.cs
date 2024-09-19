namespace toeic_web.Models
{
    public class Admin
    {
        public Guid idAdmin {  get; set; }
        public string idUser { get; set; }
        public virtual Users Users { get; set; }
        public virtual ICollection<VipPackage> VipPackages { get; set; }
    }
}
