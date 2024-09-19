using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Controllers;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Test;

namespace UnitTest.Test
{
    public class TestControllerTest
    {
        private readonly Mock<ITestService> _mockTestService;
        private readonly TestController _testController;
        public TestControllerTest()
        {
            _mockTestService = new Mock<ITestService>();
            _testController = new TestController(_mockTestService.Object);
        }
        [Fact]
        public async Task GetAllTests_ReturnsOkResult()
        {
            // Arrange
            var testList = new List<TestViewModel> {
                new(),
                new()
            };
            _mockTestService.Setup(service => service.GetAllTests()).ReturnsAsync(testList);

            // Act
            var result = await _testController.GetAllTests() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(testList, result.Value);
        }

        [Fact]
        public async Task GetAllTests_ReturnsNotFound()
        {
            // Arrange
            _mockTestService.Setup(service => service.GetAllTests()).ReturnsAsync((List<TestViewModel>)null);

            // Act
            var result = await _testController.GetAllTests() as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Fact]
        public async Task GetTestById_ReturnsOkResult()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var test = new TestViewModel();
            _mockTestService.Setup(service => service.GetTestById(testId)).ReturnsAsync(test);

            // Act
            var result = await _testController.GetTestById(testId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(test, result.Value);
        }

        [Fact]
        public async Task GetTestById_ReturnsNotFound()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockTestService.Setup(service => service.GetTestById(testId)).ReturnsAsync((TestViewModel)null);

            // Act
            var result = await _testController.GetTestById(testId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Fact]
        public async Task GetAllTestByProfessor_ReturnsOkResult()
        {
            // Arrange
            var userId = "professorId";
            var testList = new List<TestViewModel> { new TestViewModel() };
            _mockTestService.Setup(service => service.GetAllTestByProfessor(userId)).ReturnsAsync(testList);

            // Act
            var result = await _testController.GetAllTestByProfessor(userId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(testList, result.Value);
        }

        [Fact]
        public async Task GetAllTestByProfessor_ReturnsNotFound()
        {
            // Arrange
            var userId = "professorId";
            _mockTestService.Setup(service => service.GetAllTestByProfessor(userId)).ReturnsAsync((List<TestViewModel>)null);

            // Act
            var result = await _testController.GetAllTestByProfessor(userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Fact]
        public async Task GetAllTestByType_ReturnsOkResult()
        {
            // Arrange
            var typeName = "testType";
            var testList = new List<TestViewModel> { new TestViewModel() };
            _mockTestService.Setup(service => service.GetAllTestByType(typeName)).ReturnsAsync(testList);

            // Act
            var result = await _testController.GetAllTestByType(typeName) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(testList, result.Value);
        }

        [Fact]
        public async Task GetAllTestByType_ReturnsNotFound()
        {
            // Arrange
            var typeName = "testType";
            _mockTestService.Setup(service => service.GetAllTestByType(typeName)).ReturnsAsync((List<TestViewModel>)null);

            // Act
            var result = await _testController.GetAllTestByType(typeName) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status404NotFound, result.StatusCode);
        }

        [Fact]
        public async Task AddTest_ReturnsOkResult()
        {
            // Arrange
            var testModel = new TestAddModel();
            var userId = "professorId";
            _mockTestService.Setup(service => service.AddTest(testModel, userId)).ReturnsAsync(true);

            // Act
            var result = await _testController.AddTest(testModel, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
        }

        [Fact]
        public async Task AddTest_ReturnsInternalServerError()
        {
            // Arrange
            var testModel = new TestAddModel();
            var userId = "professorId";
            _mockTestService.Setup(service => service.AddTest(testModel, userId)).ReturnsAsync(false);

            // Act
            var result = await _testController.AddTest(testModel, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, result.StatusCode);
        }

        [Fact]
        public async Task UpdateTest_ReturnsOkResult()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var userId = "professorId";
            var testModel = new TestUpdateModel();
            _mockTestService.Setup(service => service.UpdateTest(testModel, testId, userId)).ReturnsAsync(true);

            // Act
            var result = await _testController.UpdateTest(testModel, testId, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
        }

        [Fact]
        public async Task UpdateTest_ReturnsInternalServerError()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var userId = "professorId";
            var testModel = new TestUpdateModel();
            _mockTestService.Setup(service => service.UpdateTest(testModel, testId, userId)).ReturnsAsync(false);

            // Act
            var result = await _testController.UpdateTest(testModel, testId, userId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, result.StatusCode);
        }

        [Fact]
        public async Task DeleteTest_ReturnsOkResult()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockTestService.Setup(service => service.DeleteTest(testId)).ReturnsAsync(true);

            // Act
            var result = await _testController.DeleteTest(testId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.True((bool)result.Value);
        }

        [Fact]
        public async Task DeleteTest_ReturnsNotFound()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockTestService.Setup(service => service.DeleteTest(testId)).ReturnsAsync(false);

            // Act
            var result = await _testController.DeleteTest(testId) as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status404NotFound, result.StatusCode);
        }
    }
}
