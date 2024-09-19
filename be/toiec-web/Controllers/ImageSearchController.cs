using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;

namespace toiec_web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageSearchController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ImageSearchController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("SearchImage/{keyword}")]
        public async Task<IActionResult> SearchImage(string keyword)
        {
            string apiKey = "AIzaSyDbqZ0hosQWUnDSULLvs7m632pPA3-hrzk";
            string searchEngineId = "c591a841fe63e4ea3";
            string searchUrl = $"https://www.googleapis.com/customsearch/v1?q={keyword}&cx={searchEngineId}&key={apiKey}&searchType=image";

            var response = await _httpClient.GetAsync(searchUrl);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error fetching images from Google");
            }

            var json = await response.Content.ReadAsStringAsync();

            // Logging the response content for debugging
            System.Diagnostics.Debug.WriteLine(json);

            try
            {
                var data = JObject.Parse(json);
                var imageUrl = data["items"]?[0]?["link"]?.ToString();

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return NotFound("No image found for the given keyword");
                }

                var imageResponse = await _httpClient.GetAsync(imageUrl);
                if (!imageResponse.IsSuccessStatusCode)
                {
                    return StatusCode((int)imageResponse.StatusCode, "Error downloading the image");
                }

                var imageStream = await imageResponse.Content.ReadAsStreamAsync();
                using (var ms = new MemoryStream())
                {
                    await imageStream.CopyToAsync(ms);
                    var imageBytes = ms.ToArray();
                    return File(imageBytes, "image/png", $"{keyword}.png");
                }
            }
            catch (Newtonsoft.Json.JsonReaderException ex)
            {
                // Logging the exception for debugging
                System.Diagnostics.Debug.WriteLine(ex);

                return StatusCode(500, "Error parsing JSON response from Google");
            }
        }
    }
}
