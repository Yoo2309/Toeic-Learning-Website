namespace toeic_web.Models
{
    public class PaymentMethod
    {
        public Guid idMethod { get; set; }
        public string name { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }   
    }
}
