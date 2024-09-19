namespace toeic_web.ViewModels.Payment
{
    public class PaymentViewModel
    {
        public Guid idPackage { get; set; }
        public string Method { get; set; }
        public string Package { get; set; }
        public string message { get; set; }
        public string paymentDate { get; set; }
        public double paymentAmount { get; set; }
    }
}
