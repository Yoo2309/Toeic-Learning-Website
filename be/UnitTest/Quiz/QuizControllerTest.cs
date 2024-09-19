using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Controllers;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Quiz;

namespace UnitTest.Quiz
{
    public class QuizControllerTest
    {
        private readonly Mock<IQuizService> _mockQuizService;
        private readonly QuizController _quizController;
        public QuizControllerTest()
        {
            _mockQuizService = new Mock<IQuizService>();
            _quizController = new QuizController(_mockQuizService.Object);
        }
        [Fact]
        public async Task GetAllQuizzes_Success()
        {
            // Arrange
            var quizList = new List<QuizViewModel>
            {
                new QuizViewModel(),
                new QuizViewModel()
            };
            _mockQuizService.Setup(service => service.GetAllQuizzes())
                .ReturnsAsync(quizList);

            // Act
            var result = await _quizController.GetAllQuizzes() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(quizList, result.Value);
        }

        [Fact]
        public async Task GetAllQuizzes_NotFound()
        {
            // Arrange
            _mockQuizService.Setup(service => service.GetAllQuizzes())
                .ReturnsAsync((List<QuizViewModel>)null);

            // Act
            var result = await _quizController.GetAllQuizzes() as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetQuizById_Success()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            var quiz = new QuizViewModel { /* Initialize your quiz here */ };
            _mockQuizService.Setup(service => service.GetQuizById(quizId))
                .ReturnsAsync(quiz);

            // Act
            var result = await _quizController.GetQuizById(quizId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(quiz, result.Value);
        }

        [Fact]
        public async Task GetQuizById_NotFound()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            _mockQuizService.Setup(service => service.GetQuizById(quizId))
                .ReturnsAsync((QuizViewModel)null);

            // Act
            var result = await _quizController.GetQuizById(quizId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task GetAllQuizByLesson_Success()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            var quizList = new List<QuizViewModel>();
            _mockQuizService.Setup(service => service.GetAllQuizByLesson(lessonId))
                .ReturnsAsync(quizList);

            // Act
            var result = await _quizController.GetAllQuizByLesson(lessonId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(quizList, result.Value);
        }

        [Fact]
        public async Task GetAllQuizByLesson_NotFound()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            _mockQuizService.Setup(service => service.GetAllQuizByLesson(lessonId))
                .ReturnsAsync((List<QuizViewModel>)null);

            // Act
            var result = await _quizController.GetAllQuizByLesson(lessonId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task AddQuiz_Success()
        {
            // Arrange
            var model = new QuizAddModel();
            _mockQuizService.Setup(service => service.AddQuiz(model))
                .ReturnsAsync(true);

            // Act
            var result = await _quizController.AddQuiz(model) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task AddQuiz_Failed()
        {
            // Arrange
            var model = new QuizAddModel();
            _mockQuizService.Setup(service => service.AddQuiz(model))
                .ReturnsAsync(false);

            // Act
            var result = await _quizController.AddQuiz(model) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
        }

        [Fact]
        public async Task UpdateQuiz_Success()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            var model = new QuizUpdateModel();
            _mockQuizService.Setup(service => service.UpdateQuiz(model, quizId))
                .ReturnsAsync(true);

            // Act
            var result = await _quizController.UpdateQuiz(model, quizId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task UpdateQuiz_Failed()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            var model = new QuizUpdateModel();
            _mockQuizService.Setup(service => service.UpdateQuiz(model, quizId))
                .ReturnsAsync(false);

            // Act
            var result = await _quizController.UpdateQuiz(model, quizId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
        }

        [Fact]
        public async Task DeleteQuiz_Success()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            _mockQuizService.Setup(service => service.DeleteQuiz(quizId))
                .ReturnsAsync(true);

            // Act
            var result = await _quizController.DeleteQuiz(quizId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.True((bool)result.Value);
        }

        [Fact]
        public async Task DeleteQuiz_Failed()
        {
            // Arrange
            var quizId = Guid.NewGuid();
            _mockQuizService.Setup(service => service.DeleteQuiz(quizId))
                .ReturnsAsync(false);

            // Act
            var result = await _quizController.DeleteQuiz(quizId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
        }
    }
}
