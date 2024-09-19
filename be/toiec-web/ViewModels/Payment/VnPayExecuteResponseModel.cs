namespace toeic_web.ViewModels.Payment
{
    public class VnPayExecuteResponseModel
    {
        public string? UserId { get; set; }
        public string? StudentId { get; set; }
        public double? Amount { get; set; }
        public string? PaymentInfo { get; set; }
        public string? Message { get; set; }
    }
}
