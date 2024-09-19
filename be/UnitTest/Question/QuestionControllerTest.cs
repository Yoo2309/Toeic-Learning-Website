using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Controllers;
using toeic_web.Services.IService;
using toeic_web.ViewModels.DoTest;
using toeic_web.ViewModels.Question;

namespace UnitTest.Question
{
    public class QuestionControllerTest
    {
        private readonly Mock<IQuestionService> _mockQuestionService;
        private readonly QuestionController _questionController;
        public QuestionControllerTest()
        {
            _mockQuestionService = new Mock<IQuestionService>();
            _questionController = new QuestionController(_mockQuestionService.Object);
        }
        [Fact]
        public async Task GetAll_Questions_Success()
        {
            // Arrange
            var expected = new List<QuestionViewModel>
            {
                new QuestionViewModel(),
                new QuestionViewModel()
            };
            _mockQuestionService.Setup(service => service.GetAllQuestions())
                .ReturnsAsync(expected);

            // Act
            var result = await _questionController.GetAllQuestions() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }

        [Fact]
        public async Task GetAll_Questions_NotFound()
        {
            // Arrange
            _mockQuestionService.Setup(service => service.GetAllQuestions())
                .ReturnsAsync((List<QuestionViewModel>)null);

            // Act
            var result = await _questionController.GetAllQuestions() as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetById_Question_Success()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            var expected = new QuestionViewModel
            {
                idQuestion = questionId,
                idProfessor = Guid.NewGuid(),
                idQuiz = Guid.NewGuid(),
                idUnit = Guid.NewGuid(),
                answer = "answer",
                choice_1 = "a",
                choice_2 = "b",
                choice_3 = "c",
                choice_4 = "d",
                content = "What letter?",
                explaination = "explanation"
            };
            _mockQuestionService.Setup(service => service.GetQuestionById(questionId))
                .ReturnsAsync(expected);

            // Act
            var result = await _questionController.GetQuestionById(questionId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }

        [Fact]
        public async Task GetById_Question_NotFound()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            _mockQuestionService.Setup(service => service.GetQuestionById(questionId))
                .ReturnsAsync((QuestionViewModel)null);

            // Act
            var result = await _questionController.GetQuestionById(questionId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetByQuiz_Question_Success()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            var expected = new List<QuestionViewModel>
            {
                new QuestionViewModel
                {
                idQuestion = Guid.NewGuid(),
                idProfessor = Guid.NewGuid(),
                idQuiz = quizId,
                idUnit = Guid.NewGuid(),
                answer = "answer",
                choice_1 = "a",
                choice_2 = "b",
                choice_3 = "c",
                choice_4 = "d",
                content = "What letter?",
                explaination = "explanation"
                },
            };
            _mockQuestionService.Setup(service => service.GetAllQuestionByQuiz(quizId))
                .ReturnsAsync(expected);

            // Act
            var result = await _questionController.GetAllQuestionByQuiz(quizId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }

        [Fact]
        public async Task GetAllQuestionByQuiz_NotFound()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            _mockQuestionService.Setup(service => service.GetAllQuestionByQuiz(quizId))
                .ReturnsAsync((List<QuestionViewModel>)null);

            // Act
            var result = await _questionController.GetAllQuestionByQuiz(quizId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetByUnit_Question_Success()
        {
            // Arrange
            var unitId = Guid.NewGuid();
            var expected = new List<QuestionViewModel>
            {
                new QuestionViewModel
                {
                idQuestion = Guid.NewGuid(),
                idProfessor = Guid.NewGuid(),
                idQuiz = Guid.NewGuid(),
                idUnit = unitId,
                answer = "answer",
                choice_1 = "a",
                choice_2 = "b",
                choice_3 = "c",
                choice_4 = "d",
                content = "What letter?",
                explaination = "explanation"
                }
            };
            _mockQuestionService.Setup(service => service.GetAllQuestionByUnit(unitId))
                .ReturnsAsync(expected);

            // Act
            var result = await _questionController.GetAllQuestionByUnit(unitId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }

        [Fact]
        public async Task GetByUnit_Question_NotFound()
        {
            // Arrange
            var unitId = Guid.NewGuid();
            _mockQuestionService.Setup(service => service.GetAllQuestionByUnit(unitId))
                .ReturnsAsync((List<QuestionViewModel>)null);

            // Act
            var result = await _questionController.GetAllQuestionByUnit(unitId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetAllQuestionByProfessor_Success()
        {
            // Arrange
            var userId = "id";
            var expected = new List<QuestionViewModel>
            {
                new QuestionViewModel
                {
                    idQuestion = Guid.NewGuid(),
                    idProfessor = Guid.NewGuid(),
                    idQuiz = Guid.NewGuid(),
                    idUnit = Guid.NewGuid(),
                    answer = "answer",
                    choice_1 = "a",
                    choice_2 = "b",
                    choice_3 = "c",
                    choice_4 = "d",
                    content = "What letter?",
                    explaination = "explanation"
                }
            };
            _mockQuestionService.Setup(service => service.GetAllQuestionByProfessor(userId))
                .ReturnsAsync(expected);

            // Act
            var result = await _questionController.GetAllQuestionByProfessor(userId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }

        [Fact]
        public async Task GetAllQuestionByProfessor_NotFound()
        {
            // Arrange
            var userId = "someUserId";
            _mockQuestionService.Setup(service => service.GetAllQuestionByProfessor(userId))
                .ReturnsAsync((List<QuestionViewModel>)null);

            // Act
            var result = await _questionController.GetAllQuestionByProfessor(userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetDoTest_Success()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var doTest = new DoTestViewModel();
            _mockQuestionService.Setup(service => service.GetDoTest(testId))
                .ReturnsAsync(doTest);

            // Act
            var result = await _questionController.GetAllQuestionByProfessor(testId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(doTest, result.Value);
        }

        [Fact]
        public async Task GetDoTest_NotFound()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockQuestionService.Setup(service => service.GetDoTest(testId))
                .ReturnsAsync((DoTestViewModel)null);

            // Act
            var result = await _questionController.GetAllQuestionByProfessor(testId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task Add_Question_Success()
        {
            // Arrange
            var model = new QuestionAddModel();
            var userId = "someUserId";
            _mockQuestionService.Setup(service => service.AddQuestion(model, userId))
                .ReturnsAsync(true);

            // Act
            var result = await _questionController.AddQuestion(model, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task Add_Question_Failed()
        {
            // Arrange
            var model = new QuestionAddModel();
            var userId = "someUserId";
            _mockQuestionService.Setup(service => service.AddQuestion(model, userId))
                .ReturnsAsync(false);

            // Act
            var result = await _questionController.AddQuestion(model, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
        }

        [Fact]
        public async Task Update_Question_Success()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            var userId = "someUserId";
            var model = new QuestionUpdateModel
            {
                idQuiz = Guid.NewGuid(),
                idUnit = Guid.NewGuid(),
                answer = "answer",
                choice_1 = "a",
                choice_2 = "b",
                choice_3 = "c",
                choice_4 = "d",
                content = "What letter?",
                explaination = "explanation"
            };
            _mockQuestionService.Setup(service => service.UpdateQuestion(model, questionId, userId))
                .ReturnsAsync(true);

            // Act
            var result = await _questionController.UpdateQuestion(model, questionId, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task UpdateQuestion_Failed()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            var userId = "someUserId";
            var model = new QuestionUpdateModel
            {
                idQuiz = Guid.NewGuid(),
                idUnit = Guid.NewGuid(),
                answer = "answer",
                choice_1 = "a",
                choice_2 = "b",
                choice_3 = "c",
                choice_4 = "d",
                content = "What letter?",
                explaination = "explanation"
            };
            _mockQuestionService.Setup(service => service.UpdateQuestion(model, questionId, userId))
                .ReturnsAsync(false);

            // Act
            var result = await _questionController.UpdateQuestion(model, questionId, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
        }

        [Fact]
        public async Task Delete_Question_Success()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            _mockQuestionService.Setup(service => service.DeleteQuestion(questionId))
                .ReturnsAsync(true);

            // Act
            var result = await _questionController.DeleteQuestion(questionId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.True((bool)result.Value);
        }

        [Fact]
        public async Task DeleteQuestion_Failed()
        {
            // Arrange
            var questionId = Guid.NewGuid();
            _mockQuestionService.Setup(service => service.DeleteQuestion(questionId))
                .ReturnsAsync(false);

            // Act
            var result = await _questionController.DeleteQuestion(questionId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }
    }
}
