using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using toeic_web.Controllers;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.UserAnswer;

namespace UnitTest.UserAnswer
{
    public class UserAnswerControllerTest
    {
        private readonly UserAnswerController _controller;
        private readonly Mock<IUserAnswerService> _mockUserAnswerService;
        public UserAnswerControllerTest()
        {
            _mockUserAnswerService = new Mock<IUserAnswerService>();
            _controller = new UserAnswerController(_mockUserAnswerService.Object);
        }
        [Fact]
        public async Task AddListUserAnswers_ReturnsOkResult_WithResponse()
        {
            // Arrange
            var models = new List<UserAnswerModel>();
            var userId = "user123";
            var testId = Guid.NewGuid();
            var expected = new UserAnswerResponseModel();
            _mockUserAnswerService.Setup(service => service.AddListUserAnswers(models, userId, testId))
                                  .ReturnsAsync(expected);

            // Act
            var result = await _controller.AddListUserAnswers(models, userId, testId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            Assert.Equal(expected, okResult.Value);
        }

        [Fact]
        public async Task AddListUserAnswers_ReturnsInternalServerError_WhenResponseIsNull()
        {
            // Arrange
            var models = new List<UserAnswerModel> { new() };
            var userId = "user123";
            var testId = Guid.NewGuid();
            _mockUserAnswerService.Setup(service => service.AddListUserAnswers(models, userId, testId))
                                  .ReturnsAsync((UserAnswerResponseModel)null);

            // Act
            var result = await _controller.AddListUserAnswers(models, userId, testId);

            // Assert
            var internalServerErrorResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status500InternalServerError, internalServerErrorResult.StatusCode);
        }

        [Fact]
        public async Task GetUserAnswerByRecord_ReturnsOkResult_WithAnswer()
        {
            // Arrange
            var recordId = Guid.NewGuid();
            var mockAnswer = new List<UserAnswerViewModel>
            {
                new UserAnswerViewModel (),
                new UserAnswerViewModel ()
            };
            _mockUserAnswerService.Setup(service => service.GetUserAnswerByRecord(recordId))
                                  .ReturnsAsync(mockAnswer);

            // Act
            var result = await _controller.GetUserAnswerByRecord(recordId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            var returnValue = Assert.IsType<List<UserAnswerViewModel>>(okResult.Value);
            Assert.Equal(mockAnswer.Count, returnValue.Count);
        }

        [Fact]
        public async Task GetUserAnswerByRecord_ReturnsNotFound_WhenAnswerIsNull()
        {
            // Arrange
            var recordId = Guid.NewGuid();
            _mockUserAnswerService.Setup(service => service.GetUserAnswerByRecord(recordId))
                                  .ReturnsAsync((IEnumerable<UserAnswerViewModel>)null);

            // Act
            var result = await _controller.GetUserAnswerByRecord(recordId);

            // Assert
            var notFoundResult = Assert.IsType<StatusCodeResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }
    }
}
