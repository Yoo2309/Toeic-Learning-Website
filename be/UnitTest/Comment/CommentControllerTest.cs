using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using toiec_web.Controllers;
using toiec_web.Models;
using toiec_web.Services.IService;
using toiec_web.ViewModels.Comment;

namespace UnitTest.Comment
{
    public class CommentControllerTest
    {
        private readonly CommentController _commentController;
        private readonly Mock<ICommentService> _mockCommentService;
        public CommentControllerTest()
        {
            _mockCommentService = new Mock<ICommentService>();
            _commentController = new CommentController(_mockCommentService.Object);
        }
        [Fact]
        public async Task GetAllFalse_Comments_Success()
        {
            //Arrange
            var expected = new List<CommentModel>
            {
                new CommentModel(),
                new CommentModel()
            };
            _mockCommentService.Setup(service => service.GetCommentFalseCheck()).ReturnsAsync(expected);

            //Act
            var result = await _commentController.GetFalseComment() as OkObjectResult;
            var resultList = result.Value as List<CommentModel>;

            //Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.IsType<List<CommentModel>>(resultList);
            Assert.Equal(2, resultList.Count);
        }
        [Fact]
        public async Task GetByLesson_Comments_Success()
        {
            //Arrange
            var idLesson = Guid.NewGuid();
            var expected_1 = new CommentViewModel
            {
                FirstComment = new FirstCommentViewModel
                {
                    idComment = Guid.NewGuid(),
                    idLesson = idLesson,
                    idUser = "001",
                    username = "username 1",
                    imageURL = null,
                    idCommentReply = Guid.NewGuid(),
                    content = "content 1",
                    createdDate = "",
                    isDeleted = false,
                },
                SecondComments = new List<FirstCommentViewModel>
                {
                    new FirstCommentViewModel
                    {
                    idComment = Guid.NewGuid(),
                    idLesson = idLesson,
                    idUser = "002",
                    username = "username 2",
                    imageURL = null,
                    idCommentReply = Guid.NewGuid(),
                    content = "content 2",
                    createdDate = "",
                    isDeleted = false,
                    },
                    new FirstCommentViewModel
                    {
                    idComment = Guid.NewGuid(),
                    idLesson = idLesson,
                    idUser = "003",
                    username = "username 3",
                    imageURL = null,
                    idCommentReply = Guid.NewGuid(),
                    content = "content 3",
                    createdDate = "",
                    isDeleted = false,
                    }
                }
            };
            var expected_2 = new CommentViewModel
            {
                FirstComment = new FirstCommentViewModel
                {
                    idComment = Guid.NewGuid(),
                    idLesson = idLesson,
                    idUser = "001",
                    username = "username",
                    imageURL = null,
                    idCommentReply = Guid.NewGuid(),
                    content = "content",
                    createdDate = "",
                    isDeleted = false,
                },
                SecondComments = new List<FirstCommentViewModel>
                {
                    new FirstCommentViewModel
                    {
                    idComment = Guid.NewGuid(),
                    idLesson = idLesson,
                    idUser = "002",
                    username = "username",
                    imageURL = null,
                    idCommentReply = Guid.NewGuid(),
                    content = "content",
                    createdDate = "",
                    isDeleted = false,
                    },
                    new FirstCommentViewModel
                    {
                    idComment = Guid.NewGuid(),
                    idLesson = idLesson,
                    idUser = "003",
                    username = "username",
                    imageURL = null,
                    idCommentReply = Guid.NewGuid(),
                    content = "content",
                    createdDate = "",
                    isDeleted = false,
                    }
                }
            };
            var expectedList = new List<CommentViewModel>{
                expected_1,
                expected_2
            };
            _mockCommentService.Setup(service => service.GetCommentByLesson(idLesson)).ReturnsAsync(expectedList);

            // Act
            var result = await _commentController.GetComment(idLesson) as OkObjectResult;
            var resultValue = result.Value as List<CommentViewModel>;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.IsType<List<CommentViewModel>>(resultValue);
            Assert.Equal(expectedList.Count, resultValue.Count);
            Assert.NotNull(resultValue[0].FirstComment);
            Assert.Equal(expected_1.FirstComment.content, resultValue[0].FirstComment.content);
        }

        [Fact]
        public async Task GetByLesson_Comments_Failed()
        {
            // Arrange
            var idLesson = Guid.NewGuid();

            _mockCommentService.Setup(service => service.GetCommentByLesson(idLesson))
                .ReturnsAsync((List<CommentViewModel>)null);

            // Act
            var result = await _commentController.GetComment(idLesson) as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal(StatusCodes.Status404NotFound, result.Value);
        }

        [Fact]
        public async Task Add_Comments_Success()
        {
            //Arrage
            var input = new CommentAddModel();
            var expected = true;
            _mockCommentService.Setup(service => service.AddComment(input)).ReturnsAsync(expected);

            //Act
            var result = await _commentController.AddComment(input) as OkObjectResult;

            //Assert
            Assert.NotNull(result);
            var added = Assert.IsType<bool>(result.Value);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, added);

        }
        [Fact]
        public async Task Add_Comments_Failed()
        {
            //Arrage
            var input = new CommentAddModel();
            _mockCommentService.Setup(service => service.AddComment(input)).ReturnsAsync(false);

            //Act
            var result = await _commentController.AddComment(input) as BadRequestObjectResult;

            //Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("An issue when add comment.", result.Value);
        }

        [Fact]
        public async Task Update_Comments_Success()
        {
            //Arrage
            var idComment = Guid.NewGuid();
            var input = new CommentUpdateModel();
            var expected = true;
            _mockCommentService.Setup(service => service.UpdateComment(input, idComment)).ReturnsAsync(true);

            //Act
            var result = await _commentController.UpdateComment(input, idComment) as OkObjectResult;

            //Assert
            Assert.NotNull(result);
            var updated = Assert.IsType<bool>(result.Value);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(expected, updated);
        }

        [Fact]
        public async Task Update_Comments_Failed()
        {
            //Arrage
            var idComment = Guid.NewGuid();
            var input = new CommentUpdateModel();
            _mockCommentService.Setup(service => service.UpdateComment(input, idComment)).ReturnsAsync(false);

            //Act
            var result = await _commentController.UpdateComment(input, idComment) as BadRequestObjectResult;

            //Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("An issue when update comment.", result.Value);
        }

        [Fact]
        public async Task Delete_Comments_Success()
        {
            // Arrange
            var idUser = "001";
            var commentId = Guid.NewGuid();
            var expected = true;

            _mockCommentService.Setup(service => service.DeleteComment(commentId, idUser)).ReturnsAsync(true);

            // Act
            var result = await _commentController.DeleteComment(commentId, idUser) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            var deleted = Assert.IsType<bool>(result.Value);
            Assert.Equal(expected, deleted);
        }
        [Fact]
        public async Task Delete_Comments_Failed()
        {
            // Arrange
            var idUser = "001";
            var commentId = Guid.NewGuid();

            _mockCommentService.Setup(service => service.DeleteComment(commentId, idUser)).ReturnsAsync(false);

            // Act
            var result = await _commentController.DeleteComment(commentId, idUser) as BadRequestObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("An issue when delete comment.", result.Value);
        }
    }
}
