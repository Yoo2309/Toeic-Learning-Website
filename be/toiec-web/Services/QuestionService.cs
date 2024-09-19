using AutoMapper;
using toeic_web.Models;
using toeic_web.Repository;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Course;
using toeic_web.ViewModels.DoTest;
using toeic_web.ViewModels.Question;

namespace toeic_web.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IMapper _mapper;
        private readonly IQuestionRepository _questionRepository;
        private readonly ITestPartRepository _testPartRepository;
        private readonly ITestQuestionUnitRepository _testQuestionUnitRepository;

        public QuestionService(IMapper mapper, IQuestionRepository questionRepository, ITestPartRepository testPartRepository,
            ITestQuestionUnitRepository testQuestionUnitRepository) 
        {
            _mapper = mapper;
            _questionRepository = questionRepository;
            _testPartRepository = testPartRepository;
            _testQuestionUnitRepository = testQuestionUnitRepository;


        }
        public async Task<bool> AddQuestion(QuestionAddModel model, string userId)
        {
            var data = _mapper.Map<QuestionModel>(model);
            return await _questionRepository.AddQuestion(data, userId);
        }

        public async Task<bool> DeleteQuestion(Guid questionId)
        {
            return await _questionRepository.DeleteQuestion(questionId);
        }

        public async Task<IEnumerable<QuestionViewModel>> GetAllQuestionByProfessor(string userId)
        {
            var data = await _questionRepository.GetAllQuestionByProfessor(userId);
            List<QuestionViewModel> listData = new List<QuestionViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<QuestionViewModel>(dataItem);
                    listData.Add(obj);                 
                }                
            }
            return listData;
        }

        public async Task<IEnumerable<QuestionViewModel>> GetAllQuestionByQuiz(Guid quizId)
        {
            var data = await _questionRepository.GetAllQuestionByQuiz(quizId);
            List<QuestionViewModel> listData = new List<QuestionViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<QuestionViewModel>(dataItem);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<QuestionViewModel>> GetAllQuestionByUnit(Guid unitId)
        {
            var data = await _questionRepository.GetAllQuestionByUnit(unitId);
            List<QuestionViewModel> listData = new List<QuestionViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<QuestionViewModel>(dataItem);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<QuestionViewModel>> GetAllQuestions()
        {
            var data = await _questionRepository.GetAllQuestions();
            List<QuestionViewModel> listData = new List<QuestionViewModel>();
            if (data != null)
            {
                foreach (var dataItem in data)
                {
                    var obj = _mapper.Map<QuestionViewModel>(dataItem);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<DoTestViewModel> GetDoTest(Guid testId)
        {
            var doTest = new DoTestViewModel();
            var partModels = new List<DoTestPartModel>();            

            var partList = await _testPartRepository.GetAllTestParts();
            
            foreach (var part in partList)
            {
                var unitModels = new List<DoTestUnitModel>();            
                var unitList = await _testQuestionUnitRepository.GetAllTestQuestionUnitByPart(part.partId, testId);
                foreach (var unit in unitList)
                {
                    var questionList = await _questionRepository.GetAllQuestionByUnit(unit.idQuestionUnit);
                    var questionModels = new List<DoTestQuestionModel>();
                    foreach (var question in questionList)
                    {
                        var objQ = _mapper.Map<DoTestQuestionModel>(question);
                        questionModels.Add(objQ);
                        
                    }
                    var objU = new DoTestUnitModel
                    {
                        idQuestionUnit = unit.idQuestionUnit,
                        partId = part.partId,
                        paragraph = unit.paragraph,
                        audio = unit.audio,
                        image = unit.image,
                        script = unit.script,
                        translation = unit.translation,
                        questions = questionModels,
                    };
                    unitModels.Add(objU);
                }
                var objP = new DoTestPartModel
                {
                    units = unitModels,
                };
                partModels.Add(objP);
            }  
            doTest.parts = partModels;
            return doTest;
        }

        public async Task<QuestionViewModel> GetQuestionById(Guid questionId)
        {
            var data = await _questionRepository.GetQuestionById(questionId);

            if (data != null)
            {
                var courseViewModel = _mapper.Map<QuestionViewModel>(data);
                return courseViewModel;
            }

            return null;
        }

        public async Task<bool> UpdateQuestion(QuestionUpdateModel model, Guid questionId, string userId)
        {
            var data = _mapper.Map<QuestionModel>(model);
            return await _questionRepository.UpdateQuestion(data, questionId ,userId);
        }
    }
}
