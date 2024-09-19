using toeic_web.Models;

namespace toeic_web.Services.IService
{
    public interface IPaymentMethodService
    {
        Task<IEnumerable<PaymentMethodModel>> GetAllPaymentMethods();
        Task<PaymentMethodModel> GetPaymentMethodById(Guid methodId);
        Task<bool> AddPaymentMethod(PaymentMethodModel model);
        Task<bool> DeletePaymentMethod(Guid methodId);
    }
}
