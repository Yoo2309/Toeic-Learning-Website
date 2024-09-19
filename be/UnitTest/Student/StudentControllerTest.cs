using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Controllers;
using toeic_web.Services.IService;

namespace UnitTest.Student
{
    public class StudentControllerTest
    {
        private readonly Mock<IStudentService> _mockStudentService;
        private readonly StudentController _studentController;
        public StudentControllerTest()
        {
            _mockStudentService = new Mock<IStudentService>();
            _studentController = new StudentController(_mockStudentService.Object);
        }
        [Fact]
        public async Task CheckFreeTest_ValidUserId_ReturnsOkResult()
        {
            // Arrange
            var userId = "validUserId";
            var expectedFreeTest = true;
            _mockStudentService.Setup(service => service.CheckFreeTest(userId))
                               .ReturnsAsync(expectedFreeTest);

            // Act
            var result = await _studentController.CheckFreeTest(userId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(expectedFreeTest, result.Value);
        }

        [Fact]
        public async Task CheckFreeTest_InvalidUserId_ReturnsOkResultWithFalse()
        {
            // Arrange
            var userId = "invalidUserId";
            var expectedFreeTest = false;
            _mockStudentService.Setup(service => service.CheckFreeTest(userId))
                               .ReturnsAsync(expectedFreeTest);

            // Act
            var result = await _studentController.CheckFreeTest(userId) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Equal(expectedFreeTest, result.Value);
        }
    }
}
