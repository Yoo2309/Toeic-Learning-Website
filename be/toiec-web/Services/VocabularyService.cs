using AutoMapper;
using NgrokApi;
using NPOI.XWPF.UserModel;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Vocabulary;

namespace toeic_web.Services
{
    public class VocabularyService : IVocabularyService
    {
        private readonly IVocabularyRepository _vocabularyRepository;
        private readonly IMapper _mapper;
        private readonly IUploadFileService _uploadFileService;

        public VocabularyService(IVocabularyRepository vocabularyRepository, IMapper mapper,
            IUploadFileService uploadFileService) 
        {
            _vocabularyRepository = vocabularyRepository;
            _mapper = mapper;
            _uploadFileService = uploadFileService;
        }
        public async Task<bool> AddVocabulary(VocabularyAddModel model)
        {
            var data = _mapper.Map<VocabularyModel>(model);
            data.idVoc = new Guid();
            if (model.image != null)
            {
                data.image = await _uploadFileService.ConvertIFormFileToBase64String(model.image);  
            }
            return await _vocabularyRepository.AddVocabularyToList(data.idList, data);
        }

        public async Task<bool> AddVocFromExistList(Guid vocId, Guid idList)
        {
            var voc = await _vocabularyRepository.GetVocabularyById(vocId);            
            var addCheck = false;

            if (voc != null)
            {
                voc.idVoc = new Guid(); 
                addCheck = await _vocabularyRepository.AddVocabularyToList(idList, voc);
            }
            return addCheck;
        }

        public async Task<bool> DeleteVocabulary(Guid idList, Guid vocId)
        {
            return await _vocabularyRepository.RemoveVocabularyFromList(idList, vocId);
        }

        public async Task<IEnumerable<VocabularyViewModel>> GetAllVocabularies()
        {
            var data = await _vocabularyRepository.GetAllVocabularies();
            var listData = new List<VocabularyViewModel>();
            if (data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<VocabularyViewModel>(item);
                    listData.Add(obj);
                }                
            }
            return listData;
        }

        public async Task<IEnumerable<VocabularyViewModel>> GetAllVocabularyByList(Guid listId)
        {
            var data = await _vocabularyRepository.GetAllVocabulariesByListId(listId);
            return _mapper.Map<IEnumerable<VocabularyViewModel>>(data);
        }

        public async Task<IEnumerable<VocabularyViewModel>> GetAllVocabularyByTopic(string topic)
        {
            var data = await _vocabularyRepository.GetAllVocabularyByTopic(topic);
            var listData = new List<VocabularyViewModel>();
            if(data != null)
            {
                foreach (var item in data)
                {
                    var obj = _mapper.Map<VocabularyViewModel>(item);
                    listData.Add(obj);
                }                
            }
            return listData;
        }

        public async Task<VocabularyModel> GetVocabularyById(Guid vocId)
        {
            var data = await _vocabularyRepository.GetVocabularyById(vocId);
            if (data != null)
            {
                var obj = _mapper.Map<VocabularyModel>(data);
                return obj;
            }
            return null;
        }

        public async Task<bool> UpdateVocabulary(VocabularyUpdateModel model, Guid vocId)
        {
            var data = _mapper.Map<VocabularyModel>(model);
            data.idVoc = vocId;
            if (model.image != null)
            {
                data.image = await _uploadFileService.ConvertIFormFileToBase64String(model.image);
            }
            return await _vocabularyRepository.UpdateVocabulary(data, vocId);
        }
    }
}
