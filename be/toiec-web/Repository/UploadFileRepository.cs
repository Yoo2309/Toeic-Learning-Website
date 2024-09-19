using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class UploadFileRepository : IUploadFileRepository
    {
        private readonly Cloudinary _cloudinary;

        public UploadFileRepository(IOptions<CloudinaryModel> config)
        {
            var acc = new Account
                (
                    config.Value.CloudName,
                    config.Value.ApiKey,
                    config.Value.ApiSecret
                );
            _cloudinary = new Cloudinary(acc);
        }

        public async Task<IEnumerable<ImageUploadResult>> AddListFileAsync(List<IFormFile> files)
        {
            var listUploadResult = new List<ImageUploadResult>();
            var uploadResult = new ImageUploadResult();
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    using var stream = file.OpenReadStream();
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),                      
                    };
                    uploadResult = await _cloudinary.UploadAsync(uploadParams);
                }
                listUploadResult.Add(uploadResult);
            }
            return listUploadResult;
        }

        public async Task<ImageUploadResult> AddFileAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    //Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }

        public async Task<VideoUploadResult> AddAudioAsync(IFormFile file)
        {
            var uploadResult = new VideoUploadResult();
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().BitRate("128k").AudioCodec("mp3")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }

        public async Task<IEnumerable<DeletionResult>> DeleteListFileAsync(List<string> listId)
        {
            var listResult = new List<DeletionResult>();
            foreach (string id in listId)
            {
                var deleteParams = new DeletionParams(id);
                var result = await _cloudinary.DestroyAsync(deleteParams);
                listResult.Add(result);
            }
            return listResult;
        }

        public async Task<DeletionResult> DeleteFileAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result;
        }      
    }
}
