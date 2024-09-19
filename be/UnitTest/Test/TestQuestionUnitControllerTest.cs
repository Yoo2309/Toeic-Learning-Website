using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Controllers;
using toeic_web.Services.IService;
using toeic_web.ViewModels.TestQuestionUnit;

namespace UnitTest.Test
{
    public class TestQuestionUnitControllerTest
    {
        private readonly Mock<ITestQuestionUnitService> _mockTestQuestionUnitService;
        private readonly Mock<IUploadFileService> _mockUploadFileService;
        private readonly TestQuestionUnitController _controller;
        public TestQuestionUnitControllerTest()
        {
            _mockTestQuestionUnitService = new Mock<ITestQuestionUnitService>();
            _mockUploadFileService = new Mock<IUploadFileService>();
            _controller = new TestQuestionUnitController(_mockTestQuestionUnitService.Object, _mockUploadFileService.Object);
        }
        [Fact]
        public async Task GetAllTestQuestionUnits_ReturnsOkResult_WithListOfTestQuestionUnits()
        {
            // Arrange
            var mockUnits = new List<TestQuestionUnitViewModel> { new(), new() };
            _mockTestQuestionUnitService.Setup(service => service.GetAllTestQuestionUnits())
                                        .ReturnsAsync(mockUnits);

            // Act
            var result = await _controller.GetAllTestQuestionUnits();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<TestQuestionUnitViewModel>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetTestQuestionUnitById_ReturnsOkResult_WithTestQuestionUnit()
        {
            // Arrange
            var unitId = Guid.NewGuid();
            var mockUnit = new TestQuestionUnitViewModel();
            _mockTestQuestionUnitService.Setup(service => service.GetTestQuestionUnitById(unitId))
                                        .ReturnsAsync(mockUnit);

            // Act
            var result = await _controller.GetTestQuestionUnitById(unitId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<TestQuestionUnitViewModel>(okResult.Value);
        }

        [Fact]
        public async Task GetTestQuestionUnitById_ReturnsNotFound_WhenUnitNotFound()
        {
            // Arrange
            var unitId = Guid.NewGuid();
            _mockTestQuestionUnitService.Setup(service => service.GetTestQuestionUnitById(unitId))
                                        .ReturnsAsync((TestQuestionUnitViewModel)null);

            // Act
            var result = await _controller.GetTestQuestionUnitById(unitId);

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            var statusCodeResult = result as StatusCodeResult;
            Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
        }
        [Fact]
        public async Task GetAllTestQuestionUnitByTest_ReturnsOkResult_WithListOfTestQuestionUnits()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var mockUnits = new List<TestQuestionUnitViewModel> { new(), new() };
            _mockTestQuestionUnitService.Setup(service => service.GetAllTestQuestionUnitByTest(testId))
                                        .ReturnsAsync(mockUnits);

            // Act
            var result = await _controller.GetAllTestQuestionUnitByTest(testId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<TestQuestionUnitViewModel>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetAllTestQuestionUnitByTest_ReturnsNotFound_WhenUnitsNotFound()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockTestQuestionUnitService.Setup(service => service.GetAllTestQuestionUnitByTest(testId))
                                        .ReturnsAsync((IEnumerable<TestQuestionUnitViewModel>)null);

            // Act
            var result = await _controller.GetAllTestQuestionUnitByTest(testId);

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            var statusCodeResult = result as StatusCodeResult;
            Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task GetAllTestQuestionUnitByPart_ReturnsOkResult_WithListOfTestQuestionUnits()
        {
            // Arrange
            var partId = Guid.NewGuid();
            var testId = Guid.NewGuid();
            var mockUnits = new List<TestQuestionUnitViewModel> { new(), new() };
            _mockTestQuestionUnitService.Setup(service => service.GetAllTestQuestionUnitByPart(partId, testId))
                                        .ReturnsAsync(mockUnits);

            // Act
            var result = await _controller.GetAllTestQuestionUnitByPart(partId, testId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<TestQuestionUnitViewModel>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetAllTestQuestionUnitByPart_ReturnsNotFound_WhenUnitsNotFound()
        {
            // Arrange
            var partId = Guid.NewGuid();
            var testId = Guid.NewGuid();
            _mockTestQuestionUnitService.Setup(service => service.GetAllTestQuestionUnitByPart(partId, testId))
                                        .ReturnsAsync((IEnumerable<TestQuestionUnitViewModel>)null);

            // Act
            var result = await _controller.GetAllTestQuestionUnitByPart(partId, testId);

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            var statusCodeResult = result as StatusCodeResult;
            Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task AddTestQuestionUnit_ReturnsOkResult_WhenSuccessfullyAdded()
        {
            // Arrange
            var model = new TestQuestionUnitAddMapModel();

            _mockTestQuestionUnitService.Setup(service => service.AddTestQuestionUnit(It.IsAny<TestQuestionUnitAddModel>()))
                                        .ReturnsAsync(true);

            // Act
            var result = await _controller.AddTestQuestionUnit(model);

            // Assert
            var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task AddTestQuestionUnit_ReturnsInternalServerError_WhenAddFails()
        {
            // Arrange
            var model = new TestQuestionUnitAddMapModel();

            _mockTestQuestionUnitService.Setup(service => service.AddTestQuestionUnit(It.IsAny<TestQuestionUnitAddModel>()))
                                        .ReturnsAsync(false);

            // Act
            var result = await _controller.AddTestQuestionUnit(model);

            // Assert
            var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task UpdateTestQuestionUnit_ReturnsOkResult_WhenSuccessfullyUpdated()
        {
            // Arrange
            var id = Guid.NewGuid();
            var model = new TestQuestionUnitUpdateMapModel();

            _mockTestQuestionUnitService.Setup(service => service.UpdateTestQuestionUnit(It.IsAny<TestQuestionUnitUpdateModel>(), id))
                                        .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateTestQuestionUnit(model, id);

            // Assert
            var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status200OK, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task UpdateTestQuestionUnit_ReturnsInternalServerError_WhenUpdateFails()
        {
            // Arrange
            var id = Guid.NewGuid();
            var model = new TestQuestionUnitUpdateMapModel();

            _mockTestQuestionUnitService.Setup(service => service.UpdateTestQuestionUnit(It.IsAny<TestQuestionUnitUpdateModel>(), id))
                                        .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateTestQuestionUnit(model, id);

            // Assert
            var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, statusCodeResult.StatusCode);
        }
        [Fact]
        public async Task DeleteTestQuestionUnit_ReturnsOkResult_WhenSuccessfullyDeleted()
        {
            // Arrange
            var id = Guid.NewGuid();
            _mockTestQuestionUnitService.Setup(service => service.DeleteTestQuestionUnit(id))
                                        .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteTestQuestionUnit(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.True((bool)okResult.Value);
        }

        [Fact]
        public async Task DeleteTestQuestionUnit_ReturnsNotFound_WhenDeleteFails()
        {
            // Arrange
            var id = Guid.NewGuid();
            _mockTestQuestionUnitService.Setup(service => service.DeleteTestQuestionUnit(id))
                                        .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteTestQuestionUnit(id);

            // Assert
            var statusCodeResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, statusCodeResult.StatusCode);
        }
    }
}
