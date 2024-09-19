using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Record;
using toeic_web.ViewModels.UserAnswer;

namespace toeic_web.Services
{
    public class UserAnswerService : IUserAnswerService
    {
        private readonly IUserAnswerRepository _userAnswerRepository;
        private readonly IMapper _mapper;

        public UserAnswerService(IUserAnswerRepository userAnswerRepository, IMapper mapper) 
        {
            _userAnswerRepository = userAnswerRepository;
            _mapper = mapper;
        }

        public async Task<UserAnswerResponseModel> AddListUserAnswers(IEnumerable<UserAnswerModel> models, string userId, Guid testId)
        { 
            return await _userAnswerRepository.AddListUserAnswers(models, userId, testId);
        }

        public async Task<bool> AddUserAnswer(UserAnswerAddModel model, string userId)
        {
            var data = _mapper.Map<UserAnswerModel>(model);
            return await _userAnswerRepository.AddUserAnswer(data, userId);
        }

        public async Task<IEnumerable<UserAnswerViewModel>> GetUserAnswerByRecord(Guid recordId)
        {
            var listData = await _userAnswerRepository.GetUserAnswerByRecord(recordId);
            var listAnswer = new List<UserAnswerViewModel>();
            foreach(var model in listData)
            {
                var obj = _mapper.Map<UserAnswerViewModel>(model);
                listAnswer.Add(obj);
            }
            return listAnswer;
        }
    }
}
