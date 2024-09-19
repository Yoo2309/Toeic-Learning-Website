using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Controllers;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Course;

namespace UnitTest.Course
{
    public class CourseControllerTest
    {
        private readonly CourseController _courseController;
        private readonly Mock<ICourseService> _mockCourseService;
        public CourseControllerTest()
        {
            _mockCourseService = new Mock<ICourseService>();
            _courseController = new CourseController(_mockCourseService.Object);
        }
        [Fact]
        public async Task GetAll_Courses_Success()
        {
            //Arrange
            var expected = new List<CourseViewModel>
            {
                new CourseViewModel(),
                new CourseViewModel()
            };
            _mockCourseService.Setup(service => service.GetAllCourses()).ReturnsAsync(expected);
            //Act
            var result = await _courseController.GetAllCourses();
            var resultType = result as OkObjectResult;
            var resultList = resultType.Value as List<CourseViewModel>;

            //Assert
            Assert.NotNull(result);
            Assert.Equal(200, resultType.StatusCode);
            Assert.IsType<List<CourseViewModel>>(resultList);
            Assert.Equal(2, resultList.Count);
        }
        [Fact]
        public async Task GetById_Courses_Success()
        {
            //Arrange
            var valid_courseId = new Guid("0eaf6926-d068-49a3-a42e-ce446d603178");
            var expected = new CourseViewModel
            {
                idCourse = valid_courseId,
                idRoadMap = "0eaf6926-d068-49a3-a42e-ce446d603177",
                name = "Test course",
                description = "Description",
                isVip = true,
            };
            _mockCourseService.Setup(service => service.GetCourseById(valid_courseId)).ReturnsAsync(expected);

            //Act
            var result = await _courseController.GetCourseById(valid_courseId);
            var resultType = result as OkObjectResult;
            var resultCourse = resultType.Value as CourseViewModel;

            //Assert
            Assert.NotNull(result);
            Assert.Equal(200, resultType.StatusCode);
            Assert.IsType<CourseViewModel>(resultCourse);
            Assert.Equal(valid_courseId, resultCourse.idCourse);
            Assert.Equal("Test course", resultCourse.name);
        }
        [Fact]
        public async Task Add_Courses_Success()
        {
            //Arrage
            var input = new CourseAddModel();
            var expected = true;
            _mockCourseService.Setup(service => service.AddCourse(input)).ReturnsAsync(expected);

            //Act
            var result = await _courseController.AddCourse(input) as OkObjectResult;

            //Assert
            Assert.NotNull(result);
            Assert.IsType<bool>(result.Value);
            Assert.Equal(200, result.StatusCode);

        }
        [Fact]
        public async Task Update_Courses_Success()
        {
            //Arrage
            var idCourse = Guid.NewGuid();
            var input = new CourseUpdateModel();
            var expected = true;
            _mockCourseService.Setup(service => service.UpdateCourse(input, idCourse)).ReturnsAsync(true);

            //Act
            var result = await _courseController.UpdateCourse(input, idCourse) as ObjectResult;

            //Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            var updated = Assert.IsType<bool>(result.Value);
            Assert.Equal(expected, updated);

        }
        [Fact]
        public async Task Delete_Courses_Success()
        {
            // Arrange
            Guid courseId = Guid.NewGuid();
            var expected = true;

            _mockCourseService.Setup(service => service.DeleteCourse(courseId)).ReturnsAsync(true);

            // Act
            var result = await _courseController.DeleteCourse(courseId) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            var deleted = Assert.IsType<bool>(result.Value);
            Assert.Equal(expected, deleted);
        }
    }
}