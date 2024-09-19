using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using toeic_web.Models;
using toiec_web.Controllers;
using toiec_web.Services.IService;
using toiec_web.ViewModels.Report;

namespace UnitTest.Record
{
    public class RecordContrllerTest
    {
        private readonly Mock<IReportService> _mockReportService;
        private readonly ReportController _reportController;
        public RecordContrllerTest()
        {
            _mockReportService = new Mock<IReportService>();
            _reportController = new ReportController(_mockReportService.Object);
        }
        [Fact]
        public async Task GetAllReports_Success()
        {
            // Arrange
            var reportList = new List<ReportViewModel>
            {
                new ReportViewModel (),
                new ReportViewModel ()
            };
            _mockReportService.Setup(service => service.GetAllReports())
                .ReturnsAsync(reportList);

            // Act
            var result = await _reportController.GetAllReports() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(reportList, result.Value);
        }

        [Fact]
        public async Task GetAllReports_NotFound()
        {
            // Arrange
            _mockReportService.Setup(service => service.GetAllReports())
                .ReturnsAsync((List<ReportViewModel>)null);

            // Act
            var result = await _reportController.GetAllReports() as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Data not found", result.Value);
        }

        [Fact]
        public async Task GetAllFalseReports_Success()
        {
            // Arrange
            var check = false; // Example value for check parameter
            var reportList = new List<ReportViewModel>
            {
                new ReportViewModel(),
                new ReportViewModel ()
            };
            _mockReportService.Setup(service => service.GetAllFalseReports(check))
                .ReturnsAsync(reportList);

            // Act
            var result = await _reportController.GetAllFalseReports(check) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(reportList, result.Value);
        }

        [Fact]
        public async Task GetAllFalseReports_NotFound()
        {
            // Arrange
            var check = false;

            _mockReportService.Setup(service => service.GetAllFalseReports(check))
                .ReturnsAsync((List<ReportViewModel>)null);

            // Act
            var result = await _reportController.GetAllFalseReports(check) as NotFoundObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Data not found", result.Value);
        }

        [Fact]
        public async Task AddReport_Success()
        {
            // Arrange
            var model = new ReportAddModel();
            _mockReportService.Setup(service => service.AddReport(model))
                .ReturnsAsync(true);

            // Act
            var result = await _reportController.AddReport(model) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            var response = Assert.IsType<Response>(result.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Added !", response.Message);
        }

        [Fact]
        public async Task AddReport_Failure()
        {
            // Arrange
            var model = new ReportAddModel();
            _mockReportService.Setup(service => service.AddReport(model))
                .ReturnsAsync(false);

            // Act
            var result = await _reportController.AddReport(model) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
            var response = Assert.IsType<Response>(result.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("An issue when insert data!", response.Message);
        }

        [Fact]
        public async Task UpdateReport_Success()
        {
            // Arrange
            var idReport = Guid.NewGuid();
            var model = new ReportUpdateModel();
            _mockReportService.Setup(service => service.UpdateReport(model, idReport))
                .ReturnsAsync(true);

            // Act
            var result = await _reportController.UpdateReport(model, idReport) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            var response = Assert.IsType<Response>(result.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Updated !", response.Message);
        }

        [Fact]
        public async Task UpdateReport_Failure()
        {
            // Arrange
            var idReport = Guid.NewGuid();
            var model = new ReportUpdateModel();
            _mockReportService.Setup(service => service.UpdateReport(model, idReport))
                .ReturnsAsync(false);

            // Act
            var result = await _reportController.UpdateReport(model, idReport) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
            var response = Assert.IsType<Response>(result.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("An issue when update data!", response.Message);
        }

        [Fact]
        public async Task DeleteReport_Success()
        {
            // Arrange
            var idReport = Guid.NewGuid();
            _mockReportService.Setup(service => service.DeleteReport(idReport))
                .ReturnsAsync(true);

            // Act
            var result = await _reportController.DeleteReport(idReport) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            var response = Assert.IsType<Response>(result.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Deleted !", response.Message);
        }

        [Fact]
        public async Task DeleteReport_Failure()
        {
            // Arrange
            var idReport = Guid.NewGuid();
            _mockReportService.Setup(service => service.DeleteReport(idReport))
                .ReturnsAsync(false);

            // Act
            var result = await _reportController.DeleteReport(idReport) as ObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
            var response = Assert.IsType<Response>(result.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("An issue when delete data!", response.Message);
        }
    }
}
