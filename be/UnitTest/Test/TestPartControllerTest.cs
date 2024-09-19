using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using toeic_web.Controllers;
using toeic_web.Services.IService;
using toeic_web.ViewModels.TestPart;

namespace UnitTest.Test
{
    public class TestPartControllerTest
    {
        private readonly Mock<ITestPartService> _mockTestPartService;
        private readonly TestPartController _testPartController;
        public TestPartControllerTest()
        {
            _mockTestPartService = new Mock<ITestPartService>();
            _testPartController = new TestPartController(_mockTestPartService.Object);
        }
        [Fact]
        public async Task GetAllTestParts_ReturnsOkResult_WithListOfTestParts()
        {
            // Arrange
            var testPartList = new List<TestPartViewModel> { new TestPartViewModel() };
            _mockTestPartService.Setup(service => service.GetAllTestParts()).ReturnsAsync(testPartList);

            // Act
            var result = await _testPartController.GetAllTestParts() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(testPartList, result.Value);
        }

        [Fact]
        public async Task GetAllTestParts_ReturnsNotFound()
        {
            // Arrange
            _mockTestPartService.Setup(service => service.GetAllTestParts()).ReturnsAsync((List<TestPartViewModel>)null);

            // Act
            var result = await _testPartController.GetAllTestParts() as StatusCodeResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status404NotFound, result.StatusCode);
        }
    }
}
