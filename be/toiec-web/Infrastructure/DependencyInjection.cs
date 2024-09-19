using Microsoft.Extensions.Caching.Memory;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services;
using toeic_web.Services.IService;
using toiec_web.Repository;
using toiec_web.Repository.IRepository;
using toiec_web.Services;
using toiec_web.Services.IService;

namespace toeic_web.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRepository(this IServiceCollection services)
        {
            services.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
            services.AddTransient(typeof(ICourseRepository), typeof(CourseRepository));
            services.AddTransient(typeof(IUserRepository), typeof(UserRepository));
            services.AddTransient(typeof(IStudentRepository), typeof(StudentRepository));
            services.AddTransient(typeof(IProfessorRepository), typeof(ProfessorRepository));
            services.AddTransient(typeof(ILessonRepository), typeof(LessonRepository));
            services.AddTransient(typeof(IQuizRepository), typeof(QuizRepository));
            services.AddTransient(typeof(IVocTopicRepository), typeof(VocTopicRepository));
            services.AddTransient(typeof(IVocabularyRepository), typeof(VocabularyRepository));
            services.AddTransient(typeof(ITestTypeRepository), typeof(TestTypeRepository));
            services.AddTransient(typeof(IPaymentMethodRepository), typeof(PaymentMethodRepository));
            services.AddTransient(typeof(IPaymentRepository), typeof(PaymentRepository));
            services.AddTransient(typeof(ITestRepository), typeof(TestRepository));
            services.AddTransient(typeof(ITestQuestionUnitRepository), typeof(TestQuestionUnitRepository));
            services.AddTransient(typeof(IUploadFileRepository), typeof(UploadFileRepository));
            services.AddTransient(typeof(ITestPartRepository), typeof(TestPartRepository));
            services.AddTransient(typeof(IQuestionRepository), typeof(QuestionRepository));
            services.AddTransient(typeof(IVipPackageRepository), typeof(VipPackageRepository));
            services.AddTransient(typeof(IAdminRepository), typeof(AdminRepository));
            services.AddTransient(typeof(IUserAnswerRepository), typeof(UserAnswerRepository));
            services.AddTransient(typeof(IRecordRepository), typeof(RecordRepository));
            services.AddTransient(typeof(IRecordRepository), typeof(RecordRepository));
            services.AddTransient(typeof(IVipStudentRepository), typeof(VipStudentRepository));
            services.AddTransient(typeof(ICommentRepository), typeof(CommentRepository));
            services.AddTransient(typeof(IReportRepository), typeof(ReportRepository));
            services.AddTransient(typeof(IRoadMapRepository), typeof(RoadMapRepository));
            services.AddTransient(typeof(IChatBotAvailableRepository), typeof(ChatBotAvailableRepository));            
            return services;

        }
        
        public static IServiceCollection AddService(this IServiceCollection services)
        {
            services.AddTransient<ICourseService, CourseService>();
            services.AddTransient<IUserService, UserService>();
            services.AddScoped<UserService>();
            services.AddTransient<IAuthenticationService, AuthenticationService>();            
            services.AddTransient<IStudentService, StudentService>();
            services.AddTransient<IProfessorService, ProfessorService>();
            services.AddTransient<ILessonService, LessonService>();
            services.AddTransient<IQuizService, QuizService>();
            services.AddTransient<IVocTopicService, VocTopicService>();
            services.AddTransient<IVocabularyService, VocabularyService>();
            services.AddTransient<ITestTypeService, TestTypeService>();
            services.AddTransient<IPaymentMethodService, PaymentMethodService>();
            services.AddTransient<IPaymentService, PaymentService>();
            services.AddTransient<ITestService, TestService>();
            services.AddTransient<ITestQuestionUnitService, TestQuestionUnitService>();
            services.AddTransient<IUploadFileService, UploadFileService>();
            services.AddTransient<ITestPartService, TestPartService>();
            services.AddTransient<IQuestionService, QuestionService>();
            services.AddTransient<IVipPackageService, VipPackageService>();
            services.AddTransient<IAdminService, AdminService>();
            services.AddTransient<IUserAnswerService, UserAnswerService>();
            services.AddTransient<IRecordService, RecordService>();
            services.AddTransient<IVipStudentService, VipStudentService>();
            services.AddScoped< IExcelHelperService, ExcelHelperService > ();
            services.AddScoped<IEmailService, EmailService>();
            services.AddTransient<ICommentService, CommentService>();
            services.AddTransient<IReportService, ReportService>();
            services.AddTransient<IRoadMapService, RoadMapService>();
            services.AddTransient<IChatBotAvailableService, ChatBotAvailableService>();
            return services;
        }
    }
}
