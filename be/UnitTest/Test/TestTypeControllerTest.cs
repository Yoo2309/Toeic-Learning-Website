using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using toeic_web.Controllers;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.TestType;

namespace UnitTest.Test
{
    public class TestTypeControllerTest
    {
        private readonly TestTypeController _controller;
        private readonly Mock<ITestTypeService> _mockTestTypeService;
        public TestTypeControllerTest()
        {
            _mockTestTypeService = new Mock<ITestTypeService>();
            _controller = new TestTypeController(_mockTestTypeService.Object);
        }
        [Fact]
        public async Task GetAllTestTypes_ReturnsOkResult_WithListOfTestTypes()
        {
            // Arrange
            var mockTypes = new List<TestTypeViewModel> { new(), new() };
            _mockTestTypeService.Setup(service => service.GetAllTestTypes())
                                .ReturnsAsync(mockTypes);

            // Act
            var result = await _controller.GetAllTestTypes();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<TestTypeViewModel>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetAllTestTypes_ReturnsNotFoundResult_WhenNoTestTypesFound()
        {
            // Arrange
            _mockTestTypeService.Setup(service => service.GetAllTestTypes())
                                .ReturnsAsync((List<TestTypeViewModel>)null);

            // Act
            var result = await _controller.GetAllTestTypes();

            // Assert
            var notFoundResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task GetTypeNameByTest_ReturnsOkResult_WithTypeName()
        {
            // Arrange
            var testId = Guid.NewGuid();
            var mockTypeName = "MockTypeName";
            _mockTestTypeService.Setup(service => service.GetTypeNameByTest(testId))
                                .ReturnsAsync(mockTypeName);

            // Act
            var result = await _controller.GetTypeNameByTest(testId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal(mockTypeName, returnValue);
        }

        [Fact]
        public async Task GetTypeNameByTest_ReturnsNotFoundResult_WhenTypeNameNotFound()
        {
            // Arrange
            var testId = Guid.NewGuid();
            _mockTestTypeService.Setup(service => service.GetTypeNameByTest(testId))
                                .ReturnsAsync((string)null);

            // Act
            var result = await _controller.GetTypeNameByTest(testId);

            // Assert
            var notFoundResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }
    }
}
