namespace toeic_web.Models
{
    public class PaymentModel
    {
        public Guid idPayment { get; set; }
        public Guid idMethod { get; set; }
        public Guid idStudent { get; set; }
        public Guid idPackage { get; set; }
        public string message { get; set; }
        public DateTime paymentDate { get; set; }
        public double paymentAmount { get; set; }
    }
}
