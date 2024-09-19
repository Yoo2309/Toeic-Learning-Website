using AutoMapper;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.X9;
using toeic_web.Helper;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Payment;

namespace toeic_web.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IMapper _mapper;
        private readonly IOptions<MomoOptionModel> _options;
        private readonly IConfiguration _configuration;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IPaymentMethodRepository _paymentMethodRepository;
        private readonly IVipPackageRepository _vipPackageRepository;
        private readonly IVipStudentRepository _vipStudentRepository;
        private static string? tmpStudentId;

        public PaymentService(IPaymentRepository paymentRepository, IStudentRepository studentRepository,
            IVipPackageRepository vipPackageRepository, IPaymentMethodRepository paymentMethodRepository,
            IVipStudentRepository vipStudentRepository, IMapper mapper, IOptions<MomoOptionModel> options
            , IConfiguration configuration)
        {
            _paymentRepository = paymentRepository;
            _mapper = mapper;
            _options = options;
            _studentRepository = studentRepository;
            _paymentMethodRepository = paymentMethodRepository;
            _vipPackageRepository = vipPackageRepository;
            _vipStudentRepository = vipStudentRepository;
            _configuration = configuration;
        }
        public async Task<bool> AddPayment(PaymentModel model)
        {
            return await _paymentRepository.AddPayment(model);
        }

        public Task<bool> DeletePayment(Guid paymentId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<PaymentViewModel>> GetAllPayment()
        {
            var data = await _paymentRepository.GetAllPayments();
            List<PaymentViewModel> listData = new List<PaymentViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<PaymentViewModel>(item);
                    var vipPackage = await _vipPackageRepository.GetVipPackageById(item.idPackage);
                    var method = await _paymentMethodRepository.GetPaymentMethodById(item.idMethod);
                    obj.Method = method.name;
                    obj.Package = vipPackage.name;
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<IEnumerable<PaymentViewModel>> GetAllPaymentByUserId(string userId)
        {
            var student = await _studentRepository.GetStudentByUserId(userId);
            var data = await _paymentRepository.GetAllPaymentByStudentId(student.idStudent);
            var listData = new List<PaymentViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<PaymentViewModel>(item);
                    var vipPackage = await _vipPackageRepository.GetVipPackageById(item.idPackage);
                    var method = await _paymentMethodRepository.GetPaymentMethodById(item.idMethod);
                    obj.Method = method.name;
                    obj.Package = vipPackage.name;
                    obj.paymentDate = item.paymentDate.ToShortDateString();
                    listData.Add(obj);
                }
                return listData;
            }
            return null;
        }

        public async Task<string> GetExpireTimeVipStudent(string userId)
        {
            try
            {
                var student = await _studentRepository.GetStudentByUserId(userId);
                var vipStudent = await _vipStudentRepository.GetVipStudentByStudentId(student.idStudent.ToString());
                if (vipStudent == null)
                    return null;
                return vipStudent.vipExpire.ToShortDateString();
            }
            catch
            {
                return null;
            }
        }

        public async Task<PaymentModel> GetPaymentById(Guid paymentId)
        {
            var data = await _paymentRepository.GetPaymentById(paymentId);
            return data;
        }

        public async Task<MomoCreatePaymentResponseModel> CreateMoMoPaymentAsync(Guid idStudent, Guid idPackage, double price)
        {
            string orderId = DateTime.UtcNow.Ticks.ToString();
            var rawData =
                $"partnerCode={_options.Value.PartnerCode}" +
                $"&accessKey={_options.Value.AccessKey}" +
                $"&requestId={orderId}&amount={price.ToString()}" +
                $"&orderId={orderId}" +
                $"&orderInfo={idPackage}" +
                $"&returnUrl={_options.Value.ReturnUrl}" +
                $"&notifyUrl={_options.Value.NotifyUrl}" +
                $"&extraData={idStudent}";

            var signature = HashHelper.ComputeHmacSha256(rawData, _options.Value.SecretKey);

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(_options.Value.MomoApiUrl);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            // Create an object representing the request data
            var requestData = new
            {
                accessKey = _options.Value.AccessKey,
                partnerCode = _options.Value.PartnerCode,
                requestType = _options.Value.RequestType,
                notifyUrl = _options.Value.NotifyUrl,
                returnUrl = _options.Value.ReturnUrl,
                orderId = orderId,
                amount = price.ToString(),
                orderInfo = idPackage,
                requestId = orderId,
                extraData = idStudent,
                signature = signature
            };
            Console.WriteLine(_options.Value.MomoApiUrl);
            // Gửi request và xử lý phản hồi
            HttpResponseMessage response = await client.PostAsJsonAsync(_options.Value.MomoApiUrl, requestData);

            string responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseBody);
            return JsonConvert.DeserializeObject<MomoCreatePaymentResponseModel>(responseBody);
        }

        public async Task<MomoExecuteResponseModel> MoMoPaymentExecuteAsync(IQueryCollection collection, Guid paymentMethodId)
        {
            var amount = collection.First(s => s.Key == "amount").Value;
            var orderInfo = collection.First(s => s.Key == "orderInfo").Value;
            var orderId = collection.First(s => s.Key == "orderId").Value;
            var extraData = collection.First(s => s.Key == "extraData").Value.ToString();
            var message = collection.First(s => s.Key == "message").Value;
            var errorCode = collection.First(s => s.Key == "errorCode").Value;
            Guid studentId = Guid.Parse(extraData);
            Guid idPackage = Guid.Parse(orderInfo);
            Console.WriteLine(studentId);
            Console.WriteLine(idPackage);
            var user = await _studentRepository.GetStudentById(studentId);
            var payment = new PaymentModel()
                {
                    idPayment = Guid.NewGuid(),
                    idMethod = paymentMethodId,
                    idStudent = studentId,
                    idPackage = idPackage,
                    message = message,
                    paymentDate = DateTime.Now,
                    paymentAmount = Double.Parse(amount),
                };
                if (errorCode == "42")
                {
                    return new MomoExecuteResponseModel()
                    {
                        UserId = user.idUser.ToString(),
                        StudentId = studentId.ToString(),
                        Amount = amount,
                        Message = "Thanh toán không thành công, giao dịch bị hủy!",
                        PaymentInfo = orderInfo,
                    };
                }
                if (errorCode == "0")
                    if (await _paymentRepository.AddPayment(payment) == true)
                    {
                        return new MomoExecuteResponseModel()
                        {
                            UserId = user.idUser.ToString(),
                            StudentId = studentId.ToString(),
                            Amount = amount,
                            Message = "Thanh toán thành công!",
                            PaymentInfo = orderInfo,
                        };
                    }
                return null;    
        }
        public Task<string> CreateVNPayPaymentUrl(Guid idStudent, Guid idPackage, double price, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();
            var urlCallBack = _configuration["Vnpay:PaymentCallBack:ReturnUrl"];
            tmpStudentId = idStudent.ToString();

            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Config:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Config:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:Config:TmnCode"]);
            pay.AddRequestData("vnp_Amount", (price * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:Config:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Config:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"{idPackage}");
            pay.AddRequestData("vnp_OrderType", "Thẻ học/ Học trực tuyến");
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick);

            var paymentUrl =
                pay.CreateRequestUrl(_configuration["Vnpay:Config:BaseUrl"], _configuration["Vnpay:Config:HashSecret"]);

            return Task.FromResult(paymentUrl);
        }

        public async Task<VnPayExecuteResponseModel> VNPayPaymentExecute(IQueryCollection collections, Guid paymentMethodId)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _configuration["Vnpay:Config:HashSecret"]);
            Guid studentId = Guid.Parse(tmpStudentId);
            Guid idPackage = Guid.Parse(response.OrderInfo);
            Console.WriteLine(studentId);
            Console.WriteLine(idPackage);
            var user = await _studentRepository.GetStudentById(studentId);
            PaymentModel payment = new PaymentModel()
            {
                idPayment = Guid.NewGuid(),
                idMethod = paymentMethodId,
                idStudent = studentId,
                idPackage = idPackage,
                message = "Success",
                paymentDate = DateTime.Now,
                paymentAmount = response.Amount / 100,
            };
            if (!response.Success)
            {
                return new VnPayExecuteResponseModel()
                {
                    UserId = user.idUser.ToString(),
                    StudentId = studentId.ToString(),
                    Amount = response.Amount / 100,
                    Message = "Thanh toán không thành công, giao dịch bị hủy!",
                    PaymentInfo = response.OrderInfo,
                };
            }
            if (response.Success)
                if (await _paymentRepository.AddPayment(payment) == true)
                {
                    return new VnPayExecuteResponseModel()
                    {
                        UserId = user.idUser.ToString(),
                        StudentId = studentId.ToString(),
                        Amount = response.Amount / 100,
                        Message = "Thanh toán thành công!",
                        PaymentInfo = response.OrderInfo,
                    };
                }
            return null;
        }
    }
}
