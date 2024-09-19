using toeic_web.Models;
using toeic_web.Infrastructure;
using toeic_web.Repository.IRepository;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace toeic_web.Repository
{
    public class PaymentRepository : Repository<Payment>, IPaymentRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IStudentRepository _studentRepository;

        public PaymentRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper
            , IStudentRepository studentRepository) : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _studentRepository = studentRepository;
        }

        public Task<bool> AddPayment(PaymentModel model)
        {
            try
            {
                var payment = _mapper.Map<Payment>(model);

                //payment.idPayment = Guid.NewGuid();
                Entities.Add(payment);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeletePayment(Guid paymentId)
        {
            var payment = GetById(paymentId);
            if (payment == null)
            {
                throw new ArgumentNullException(nameof(payment));
            }
            Entities.Remove(payment);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<PaymentModel>> GetAllPaymentByStudentId(Guid studentId)
        {
            var listData = new List<PaymentModel>();
            var payments = await Entities.ToListAsync();
            foreach (var payment in payments)
            {
                if (payment.idStudent == studentId)
                {
                    var paymentModel = _mapper.Map<PaymentModel>(payment);
                    listData.Add(paymentModel);
                }
            }
            return listData.OrderByDescending(p => p.paymentDate);
        }

        public async Task<IEnumerable<PaymentModel>> GetAllPayments()
        {
            var listData = new List<PaymentModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<PaymentModel>(item);
                listData.Add(obj);
            }
            return listData.OrderByDescending(p => p.paymentDate);
        }

        public async Task<PaymentModel> GetPaymentById(Guid paymentId)
        {
            var payment = await Entities.FirstOrDefaultAsync(p => p.idPayment == paymentId);
            PaymentModel data = _mapper.Map<PaymentModel>(payment);
            return data;
        }
    }
}
