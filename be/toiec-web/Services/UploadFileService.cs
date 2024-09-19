using CloudinaryDotNet.Actions;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;

namespace toeic_web.Services
{
    public class UploadFileService : IUploadFileService
    {
        private readonly IUploadFileRepository _uploadFileRepository;

        public UploadFileService(IUploadFileRepository uploadFileRepository)
        {
            _uploadFileRepository = uploadFileRepository;
        }

        public async Task<IEnumerable<ImageUploadResult>> AddListFileAsync(List<IFormFile> files)
        {
            return await _uploadFileRepository.AddListFileAsync(files);
        }

        public async Task<ImageUploadResult> AddFileAsync(IFormFile file)
        {
            return await _uploadFileRepository.AddFileAsync(file);
        }

        public async Task<IEnumerable<DeletionResult>> DeleteListFileAsync(List<string> listId)
        {
            return await _uploadFileRepository.DeleteListFileAsync(listId);
        }

        public async Task<DeletionResult> DeleteFileAsync(string publicId)
        {
            return await _uploadFileRepository.DeleteFileAsync(publicId);
        }

        public async Task<VideoUploadResult> AddAudioAsync(IFormFile file)
        {
            return await _uploadFileRepository.AddAudioAsync(file);
        }

        public async Task<string> ConvertIFormFileToBase64String(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();
            return Convert.ToBase64String(fileBytes);
        }

        public IFormFile ConvertBase64StringToIFormFile(string base64Data)
        {
            if (string.IsNullOrEmpty(base64Data))
            {
                return null;
            }

            byte[] imageBytes = Convert.FromBase64String(base64Data);

            // Tạo bộ nhớ tạm từ mảng byte
            using var stream = new MemoryStream(imageBytes);
            // Tạo một IFormFile từ bộ nhớ tạm
            IFormFile formFile = new FormFile(stream, 0, stream.Length, null, "image.png")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            return formFile;
        }
        public byte[] ConvertBase64StringToByteArray(string base64Data)
        {
            if (string.IsNullOrEmpty(base64Data))
            {
                return null;
            }
            return Convert.FromBase64String(base64Data);
        }
    }
}
