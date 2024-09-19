using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.ViewModels.UserAnswer;

namespace toeic_web.Repository
{
    public class UserAnswerRepository : Repository<UserAnswer>, IUserAnswerRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IStudentRepository _studentRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly ToeicDbContext _dbContext;
        private readonly IRecordRepository _recordRepository;

        public UserAnswerRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper
            , IStudentRepository studentRepository, IQuestionRepository questionRepository,
            IRecordRepository recordRepository) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _studentRepository = studentRepository;
            _questionRepository = questionRepository;
            _dbContext = dbContext;
            _recordRepository = recordRepository;
        }

        public async Task<bool> AddUserAnswer(UserAnswerModel model, string userId)
        {
            try
            {
                //get idStudent
                var student = await _studentRepository.GetStudentByUserId(userId);

                var answer = _mapper.Map<UserAnswer>(model);
                Entities.Add(answer);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<bool> SaveUserAnswer(UserAnswerModel model)
        {
            try
            {
                var answer = _mapper.Map<UserAnswer>(model);
                Entities.Add(answer);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<UserAnswerResponseModel> AddListUserAnswers(IEnumerable<UserAnswerModel> models, string userId, Guid testId)
        {
            try
            {
                //get idStudent
                var student = await _studentRepository.GetStudentByUserId(userId);

                var listAnswers = _mapper.Map<List<UserAnswerModel>>(models);
                var initRecord = new RecordModel
                {
                    idRecord = Guid.NewGuid(),
                    idTest = testId,
                    idStudent = student.idStudent,
                    createDate = DateTime.Now,
                    listenCorrect = 0,
                    listenScore = 0,
                    readingCorrect = 0,
                    readScore = 0,
                    correctAns = 0,
                    wrongAns = 0,
                    totalScore = 0
                };


                //save answers
                foreach (var answer in listAnswers)
                {
                    answer.idUAnswer = Guid.NewGuid();
                    answer.idStudent = student.idStudent;
                    answer.idRecord = initRecord.idRecord;


                    //check userChoice
                    var question = await _questionRepository.GetQuestionById(answer.idQuestion);
                    if (question.answer == answer.userChoice)
                    {
                        answer.state = true;
                    }
                    else
                    {
                        answer.state = false;
                    }
                }

                //calculate score
                var score = await CalculateScore(listAnswers);

                //map to recordModel
                initRecord.listenCorrect = score.listenCorrect;
                initRecord.listenScore = score.listenScore;
                initRecord.readingCorrect = score.readingCorrect;
                initRecord.readScore = score.readScore;
                initRecord.correctAns = score.correctAns;
                initRecord.wrongAns = score.wrongAns;
                initRecord.totalScore = score.totalScore;

                //add record
                await _recordRepository.AddRecord(initRecord);
                listAnswers.ForEach(async answer =>
                {
                    await SaveUserAnswer(answer);
                });

                //update free test
                student.freeTest = false;
                await _studentRepository.UpdateStudent(student);
                _uow.SaveChanges();

                var response = new UserAnswerResponseModel
                {
                    idRecord = initRecord.idRecord,
                    freetest = student.freeTest
                };
                return response;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ScoreUserAnserModel> CalculateScore(List<UserAnswerModel> models)
        {
            var data = new ScoreUserAnserModel();
            var listParam =await _dbContext.ScoreParams.ToListAsync();

            // count
            int listenCorrect = 0;
            int readCorrect = 0;
            int wrongAnswer = 0;

            foreach (var answer in models)
            {
                // get partName from UserAnswer
                var partName = await GetPartName(answer);
                // check partName
                if (partName == "Part 1" || partName == "Part 2" || partName == "Part 3" || partName == "Part 4")
                {
                    if (answer.state)
                        listenCorrect++;
                    else
                        wrongAnswer++;
                }
                else if (partName == "Part 5" || partName == "Part 6" || partName == "Part 7")
                {
                    if (answer.state)
                        readCorrect++;
                    else
                        wrongAnswer++;
                }
            }

            foreach (var item in listParam)
            {
                if(listenCorrect == item.correctAnswers)
                {
                    data.listenScore = item.listenningScore;
                }
                if(readCorrect == item.correctAnswers)
                {
                    data.readScore = item.readingScore;
                }
            }
            //map data
            data.listenCorrect = listenCorrect;
            data.readingCorrect = readCorrect;
            data.correctAns = listenCorrect + readCorrect;
            data.wrongAns = wrongAnswer;
            data.totalScore = data.listenScore + data.readScore;

            return data;
        }

        public async Task<IEnumerable<UserAnswerModel>> GetAllUserAnswerByStudent(string userId)
        {
            //get idStudent 
            var student = await _studentRepository.GetStudentByUserId(userId);

            var data = await Entities.ToListAsync();
            var listData = new List<UserAnswerModel>();
            foreach (var item in data)
            {
                if (item.idStudent == student.idStudent)
                {
                    var obj = _mapper.Map<UserAnswerModel>(item);
                    listData.Add(obj);
                }
            } 
            return listData;
        }

        public async Task<string> GetPartName(UserAnswerModel model)
        {
            var question = await _dbContext.Questions
                .Where(q => q.idQuestion == model.idQuestion)
                .FirstOrDefaultAsync();

            var unit = await _dbContext.TestQuestionUnits
                .Where(u => u.idQuestionUnit == question.idUnit)
                .FirstOrDefaultAsync();

            var part = await _dbContext.TestParts
                .Where(tp => tp.partId == unit.idTestPart)
                .Select(tp => tp.partName)
                .FirstOrDefaultAsync();
            return part;
        }

        public async Task<IEnumerable<UserAnswerModel>> GetUserAnswerByRecord(Guid recordId)
        {
            var data = await Entities.Where(rc => rc.idRecord == recordId)
                .OrderBy(rc => rc.idUAnswer)
                .ToListAsync();

            var listData = new List<UserAnswerModel>();
            foreach (var item in data)
            {
                var obj = _mapper.Map<UserAnswerModel>(item);
                listData.Add(obj);
            }
            return listData;
        }
    }
}
