using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using toeic_web.Controllers;
using toeic_web.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace toiec_web.Controllers
{
    public class SQLScriptGenerator : BaseAPIController
    {
        private readonly ToeicDbContext _dbContext;

        public SQLScriptGenerator(ToeicDbContext toeicDbContext)
        {
            _dbContext = toeicDbContext;
        }

        [HttpPost("generate")]
        public IActionResult GenerateScripts()
        {
            try
            {
                var fileName = GenerateScriptsToFile();
                var fileBytes = System.IO.File.ReadAllBytes(fileName); // Sử dụng System.IO.File.ReadAllBytes để đọc file
                return File(fileBytes, "application/octet-stream", Path.GetFileName(fileName)); // Sử dụng phương thức ControllerBase.File để trả về file
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GenerateScriptsToFile()
        {
            var fileName = @".\SQLData\backup.sql";
            var connection = _dbContext.Database.GetDbConnection();

            if (System.IO.File.Exists(fileName)) // Sử dụng System.IO.File.Exists
            {
                System.IO.File.Delete(fileName); // Sử dụng System.IO.File.Delete
            }

            try
            {
                // Open the MySQL connection
                using (var mySqlConnection = new MySqlConnection(connection.ConnectionString))
                {
                    mySqlConnection.Open();

                    // Prepare the SQL script command
                    var commandText = "SHOW TABLES;"; // Modify this query based on your needs
                    using (var command = new MySqlCommand(commandText, mySqlConnection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            using (var writer = new StreamWriter(fileName, false))
                            {
                                while (reader.Read())
                                {
                                    // Get table names and write script to file
                                    var tableName = reader.GetString(0);
                                    var script = GenerateTableScript(mySqlConnection, tableName);
                                    writer.WriteLine(script);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while generating scripts: {ex.Message}");
            }
            return fileName;
        }

        private string GenerateTableScript(MySqlConnection connection, string tableName)
        {
            // Generate CREATE TABLE script for the given table
            var commandText = $"SHOW CREATE TABLE `{tableName}`;";
            using (var command = new MySqlCommand(commandText, connection))
            {
                var createTableScript = command.ExecuteScalar()?.ToString();
                return createTableScript ?? $"-- No script for table {tableName}";
            }
        }
    }
}
