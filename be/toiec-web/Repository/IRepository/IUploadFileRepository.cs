using CloudinaryDotNet.Actions;

namespace toeic_web.Repository.IRepository
{
    public interface IUploadFileRepository
    {        
        Task<ImageUploadResult> AddFileAsync(IFormFile file);
        Task<VideoUploadResult> AddAudioAsync(IFormFile file);
        Task<IEnumerable<ImageUploadResult>> AddListFileAsync(List<IFormFile> files);
        Task<DeletionResult> DeleteFileAsync(string publicId);
        Task<IEnumerable<DeletionResult>> DeleteListFileAsync(List<string> listId);
    }
}
