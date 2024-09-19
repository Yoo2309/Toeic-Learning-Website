using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class PaymentMethodRepository : Repository<PaymentMethod>, IPaymentMethodRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public PaymentMethodRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
        }
        public Task<bool> AddPaymentMethod(PaymentMethodModel model)
        {
            try
            {
                var paymentMethod = _mapper.Map<PaymentMethod>(model);
                paymentMethod.idMethod = Guid.NewGuid();
                Entities.Add(paymentMethod);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeletePaymentMethod(Guid paymentMethodId)
        {
            var paymentMethod = GetById(paymentMethodId);
            if (paymentMethod == null)
            {
                throw new ArgumentNullException(nameof(paymentMethod));
            }
            Entities.Remove(paymentMethod);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<PaymentMethodModel>> GetAllPaymentMethods()
        {
            var listData = new List<PaymentMethodModel>();
            var data = await Entities.ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<PaymentMethodModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<PaymentMethodModel> GetPaymentMethodById(Guid paymentMethodId)
        {
            IAsyncEnumerable<PaymentMethod> paymentMethods = Entities.AsAsyncEnumerable();
            await foreach (var paymentMethod in paymentMethods)
            {
                if (paymentMethod.idMethod == paymentMethodId)
                {
                    PaymentMethodModel data = _mapper.Map<PaymentMethodModel>(paymentMethod);
                    return data;
                }
            }
            return null;
        }
    }
}
