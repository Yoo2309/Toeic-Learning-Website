using toeic_web.Models;
using toeic_web.ViewModels.Payment;

namespace toeic_web.Services.IService
{
    public interface IPaymentService
    {
        Task<IEnumerable<PaymentViewModel>> GetAllPayment();
        Task<IEnumerable<PaymentViewModel>> GetAllPaymentByUserId(string userId);
        Task<string> GetExpireTimeVipStudent(string userId);
        Task<PaymentModel> GetPaymentById(Guid paymentId);
        Task<bool> AddPayment(PaymentModel model);
        Task<bool> DeletePayment(Guid paymentId);
        Task<MomoCreatePaymentResponseModel> CreateMoMoPaymentAsync(Guid idStudent, Guid idPackage, double price);
        Task<MomoExecuteResponseModel> MoMoPaymentExecuteAsync(IQueryCollection collection, Guid idMethod);
        Task<string> CreateVNPayPaymentUrl(Guid idStudent, Guid idPackage, double price, HttpContext context);
        Task<VnPayExecuteResponseModel> VNPayPaymentExecute(IQueryCollection collections, Guid paymentMethodId);
    }
}
