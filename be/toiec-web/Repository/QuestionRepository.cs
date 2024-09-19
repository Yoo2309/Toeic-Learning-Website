using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.ViewModels.DoTest;

namespace toeic_web.Repository
{
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly ToeicDbContext _dbContext;
        private readonly IProfessorRepository _professorRepository;
        private readonly ITestQuestionUnitRepository _testQuestionUnitRepository;

        public QuestionRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper
            , IProfessorRepository professorRepository, ITestQuestionUnitRepository testQuestionUnitRepository) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _professorRepository = professorRepository;
            _testQuestionUnitRepository = testQuestionUnitRepository;
            _dbContext = dbContext;
        }

        public async Task<bool> AddQuestion(QuestionModel model, string userId)
        {
            try
            {
                //get professor by userId
                var professor = await _professorRepository.GetProfessorByUserId(userId);
                
                var question = _mapper.Map<Question>(model);
                question.idQuestion = Guid.NewGuid();
                question.idProfessor = professor.idProfessor;
                
                Entities.Add(question);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteQuestion(Guid questionId)
        {
            var question = GetById(questionId);
            if (question == null)
            {
                throw new ArgumentNullException(nameof(question));
            }
            Entities.Remove(question);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<QuestionModel>> GetAllQuestionByProfessor(string userId)
        {
            //get professor by userId
            var professor = await _professorRepository.GetProfessorByUserId(userId);

            var listData = new List<QuestionModel>();
            var data = await Entities.OrderBy(q => q.idQuestion).ToListAsync();
            foreach (var item in data)
            {
                if (item.idProfessor == professor.idProfessor)
                {
                    var obj = _mapper.Map<QuestionModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<QuestionModel>> GetAllQuestionByQuiz(Guid quizId)
        {
            var listData = new List<QuestionModel>();
            var data = await Entities.OrderBy(q => q.idQuestion).ToListAsync();
            foreach (var item in data)
            {
                if (item.idQuiz == quizId) 
                {
                    var obj = _mapper.Map<QuestionModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<QuestionModel>> GetAllQuestionByUnit(Guid unitId)
        {
            var listData = new List<QuestionModel>();
            var data = await Entities.OrderBy(q => q.idQuestion).ToListAsync();
            foreach (var item in data)
            {
                if (item.idUnit == unitId)
                {
                    var obj = _mapper.Map<QuestionModel>(item);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public async Task<IEnumerable<QuestionModel>> GetAllQuestions()
        {
            var listData = new List<QuestionModel>();
            var data = await Entities.OrderBy(q => q.idQuestion).ToListAsync();
            foreach (var item in data)
            {
                var obj = _mapper.Map<QuestionModel>(item);
                listData.Add(obj);
            }
            return listData;
        }

        public async Task<QuestionModel> GetQuestionById(Guid questionId)
        {
            IAsyncEnumerable<Question> questions = Entities.AsAsyncEnumerable();
            await foreach (var course in questions)
            {
                if (course.idQuestion == questionId)
                {
                    QuestionModel data = _mapper.Map<QuestionModel>(course);
                    return data;
                }
            }
            return null;
        }


        public async Task<bool> UpdateQuestion(QuestionModel model, Guid questionId, string userId)
        {
            try
            {
                //get professor by userId
                var professor = await _professorRepository.GetProfessorByUserId(userId);

                var question = _mapper.Map<Question>(model);
                question.idQuestion = questionId;
                question.idProfessor = professor.idProfessor;
                Entities.Update(question);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
