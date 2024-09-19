using toeic_web.Models;

namespace toeic_web.Repository.IRepository
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<PaymentModel>> GetAllPayments();
        Task<PaymentModel> GetPaymentById(Guid paymentId);
        Task<IEnumerable<PaymentModel>> GetAllPaymentByStudentId(Guid studentId);
        Task<bool> AddPayment(PaymentModel model);
        Task<bool> DeletePayment(Guid paymentId);
    }
}
