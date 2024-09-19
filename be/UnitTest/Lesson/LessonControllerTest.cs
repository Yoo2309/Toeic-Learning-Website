using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using toeic_web.Controllers;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Lesson;
using toiec_web.Services.IService;

namespace UnitTest.Lesson
{
    public class LessonControllerTest
    {
        private readonly Mock<ILessonService> _mockLessonService;
        private readonly Mock<IWebHostEnvironment> _mockWebHostEnvironment;
        private readonly ToeicDbContext _dbContext;
        private readonly Mock<IExcelHelperService> _mockExcelHelperService;
        private readonly LessonController _lessonController;
        public LessonControllerTest()
        {
            _mockLessonService = new Mock<ILessonService>();
            _mockWebHostEnvironment = new Mock<IWebHostEnvironment>();

            var options = new DbContextOptionsBuilder<ToeicDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _dbContext = new ToeicDbContext(options);

            _mockExcelHelperService = new Mock<IExcelHelperService>();
            _lessonController = new LessonController
                (_mockLessonService.Object, _mockWebHostEnvironment.Object, _dbContext, _mockExcelHelperService.Object);
        }
        [Fact]
        public async Task GetAll_Lessons_Success()
        {
            // Arrange
            var expected = new List<LessonViewModel>
            {
                new LessonViewModel(),
                new LessonViewModel()
            };
            _mockLessonService.Setup(service => service.GetAllLessons())
                .ReturnsAsync(expected);

            // Act
            var result = await _lessonController.GetAllLessons() as OkObjectResult;
            var resultList = result.Value as List<LessonViewModel>;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(2, resultList.Count);
        }
        [Fact]
        public async Task GetAll_Lessons_NotFound()
        {
            // Arrange
            _mockLessonService.Setup(service => service.GetAllLessons())
                .ReturnsAsync((List<LessonViewModel>)null);

            // Act
            var result = await _lessonController.GetAllLessons() as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(StatusCodes.Status404NotFound, result.Value);
        }
        [Fact]
        public async Task GetById_Lesson_Success()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            var expected = new LessonViewModel
            {
                idLesson = lessonId,
                idCourse = Guid.NewGuid(),
                title = "title",
                content = "content",
                isVip = true
            };
            _mockLessonService.Setup(service => service.GetLessonById(lessonId))
                .ReturnsAsync(expected);

            // Act
            var result = await _lessonController.GetLessonById(lessonId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }
        [Fact]
        public async Task GetById_Lesson_NotFound()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            _mockLessonService.Setup(service => service.GetLessonById(lessonId))
                .ReturnsAsync((LessonViewModel)null);

            // Act
            var result = await _lessonController.GetLessonById(lessonId) as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(StatusCodes.Status404NotFound, result.Value);
        }
        [Fact]
        public async Task GetByCourse_Lesson_Success()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var expected = new List<LessonViewModel>
            {
                new LessonViewModel
                {
                idLesson = Guid.NewGuid(),
                idCourse = courseId,
                title = "title 1",
                content = "content 1",
                isVip = true
                },
                new LessonViewModel
                {
                idLesson = Guid.NewGuid(),
                idCourse = courseId,
                title = "title 2",
                content = "content 2",
                isVip = true
                }
            };
            _mockLessonService.Setup(service => service.GetAllLessonByCourse(courseId))
                .ReturnsAsync(expected);

            // Act
            var result = await _lessonController.GetAllLessonByCourse(courseId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, result.Value);
        }
        [Fact]
        public async Task GetByCourse_Lesson_NotFound()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            _mockLessonService.Setup(service => service.GetAllLessonByCourse(courseId))
                .ReturnsAsync((List<LessonViewModel>)null);

            // Act
            var result = await _lessonController.GetAllLessonByCourse(courseId) as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(StatusCodes.Status404NotFound, result.Value);
        }
        [Fact]
        public async Task Add_Lesson_Success()
        {
            // Arrange
            var model = new LessonAddModel();
            _mockLessonService.Setup(service => service.AddLesson(model))
                .ReturnsAsync(true);

            // Act
            var result = await _lessonController.AddLesson(model) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.True((bool)result.Value);
        }
        [Fact]
        public async Task Add_Lesson_Failed()
        {
            // Arrange
            var model = new LessonAddModel();
            _mockLessonService.Setup(service => service.AddLesson(model))
                .ReturnsAsync(false);

            // Act
            var result = await _lessonController.AddLesson(model) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("An issue when add lesson.", result.Value);
        }
        [Fact]
        public async Task Update_Lesson_Success()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            var model = new LessonUpdateModel();
            _mockLessonService.Setup(service => service.UpdateLesson(model, lessonId))
                .ReturnsAsync(true);

            // Act
            var result = await _lessonController.UpdateLesson(model, lessonId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.True((bool)result.Value);
        }
        [Fact]
        public async Task Update_Lesson_Failed()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            var model = new LessonUpdateModel();
            _mockLessonService.Setup(service => service.UpdateLesson(model, lessonId))
                .ReturnsAsync(false);

            // Act
            var result = await _lessonController.UpdateLesson(model, lessonId) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("An issue when update lesson.", result.Value);
        }
        [Fact]
        public async Task Delete_Lesson_Success()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            _mockLessonService.Setup(service => service.DeleteLesson(lessonId))
                .ReturnsAsync(true);

            // Act
            var result = await _lessonController.DeleteLesson(lessonId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.True((bool)result.Value);
        }
        [Fact]
        public async Task Delete_Lesson_Failed()
        {
            // Arrange
            var lessonId = Guid.NewGuid();
            _mockLessonService.Setup(service => service.DeleteLesson(lessonId))
                .ReturnsAsync(false);

            // Act
            var result = await _lessonController.DeleteLesson(lessonId) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("An issue when delete lesson.", result.Value);
        }
    }
}
