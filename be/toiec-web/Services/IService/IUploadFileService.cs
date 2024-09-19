using CloudinaryDotNet.Actions;

namespace toeic_web.Services.IService
{
    public interface IUploadFileService
    {
        Task<string> ConvertIFormFileToBase64String(IFormFile file);
        public IFormFile ConvertBase64StringToIFormFile(string base64Data);
        public byte[] ConvertBase64StringToByteArray(string base64Data);
        Task<ImageUploadResult> AddFileAsync(IFormFile file);
        Task<VideoUploadResult> AddAudioAsync(IFormFile file);
        Task<IEnumerable<ImageUploadResult>> AddListFileAsync(List<IFormFile> files);
        Task<DeletionResult> DeleteFileAsync(string publicId);
        Task<IEnumerable<DeletionResult>> DeleteListFileAsync(List<string> listId);
    }
}
