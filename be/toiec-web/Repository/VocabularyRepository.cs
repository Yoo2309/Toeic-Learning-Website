using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toeic_web.Repository.IRepository;

namespace toeic_web.Repository
{
    public class VocabularyRepository : Repository<Vocabulary>, IVocabularyRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly ToeicDbContext _toeicDbContext;
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(5);

        public VocabularyRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper, 
            ToeicDbContext toeicDbContext, IMemoryCache cache) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
            _toeicDbContext = toeicDbContext;
            _cache = cache;
        }

        public async Task<bool> AddVocabulary(VocabularyModel model, string userId)
        {
            try
            {               
                var voc = _mapper.Map<Vocabulary>(model);
                voc.idVoc = Guid.NewGuid();
                Entities.Add(voc);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> AddVocabularyToList(Guid listId, VocabularyModel model)
        {
            var vocList = await _toeicDbContext.VocList
                .Include(v => v.Vocabularies)
                .FirstOrDefaultAsync(v => v.idVocList == listId);
            var vocItem = _mapper.Map<Vocabulary>(model);

            if (vocList == null)
            {
                return false;
            }
            vocList.Vocabularies.Add(vocItem);
            vocList.quantity = vocList.Vocabularies.Count;
            _toeicDbContext.Update(vocList);
            _uow.SaveChanges() ;
            return true;
        }

        public async Task<bool> DeleteVocabulary(Guid vocId)
        {
            var voc = GetById(vocId);
            if (voc == null)
            {
                return await Task.FromResult(false);
            }
            Entities.Remove(voc);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<VocabularyModel>> GetAllVocabularies()
        {
            var listData = await Entities.OrderBy(v => v.engWord)
                .Select(v => new VocabularyModel
                {
                    idVoc = v.idVoc,
                    idList = v.idList,
                    topic = v.topic,
                    engWord = v.engWord,
                    pronunciation = v.pronunciation,
                    wordType = v.wordType,
                    meaning = v.meaning,
                    image = null,
                    example = v.example,
                    status = v.status,
                })
                .ToListAsync();
            return _mapper.Map<IEnumerable<VocabularyModel>>(listData);
        }
        public async Task<IEnumerable<VocabularyModel>> GetAllVocabulariesByListId(Guid listId)
        {
            var listData = await Entities
                .Where(v => v.idList == listId)
                .OrderBy(v => v.engWord)
                .Select(v => new VocabularyModel
                {
                    idVoc = v.idVoc,
                    idList = v.idList,
                    topic = v.topic,
                    engWord = v.engWord,
                    pronunciation = v.pronunciation,
                    wordType = v.wordType,
                    meaning = v.meaning,
                    image = null,
                    example = v.example,
                    status = v.status,
                })
                .ToListAsync();

            return _mapper.Map<IEnumerable<VocabularyModel>>(listData);
        }


        public async Task<IEnumerable<VocabularyModel>> GetAllVocabularyByTopic(string topic)
        {
            var listData = await Entities.OrderBy(v => v.engWord)
                .Select(v => new VocabularyModel
                { 
                    idVoc = v.idVoc,
                    idList = v.idList,
                    topic = v.topic,
                    engWord = v.engWord,
                    pronunciation = v.pronunciation,
                    wordType = v.wordType,
                    meaning = v.meaning,
                    image = null,
                    example = v.example,
                    status = v.status,
                })
                .ToListAsync();
            return _mapper.Map<IEnumerable<VocabularyModel>>(listData);
        }

        public async Task<VocabularyModel> GetVocabularyById(Guid vocId)
        {
            var cacheKey = $"Vocabulary_{vocId}";
            if (!_cache.TryGetValue(cacheKey, out VocabularyModel vocabulary))
            {
                var voc = await Entities.FirstOrDefaultAsync(v => v.idVoc == vocId);
                if (voc != null)
                {
                    vocabulary = _mapper.Map<VocabularyModel>(voc);
                    _cache.Set(cacheKey, vocabulary, _cacheDuration);
                }
            }
            return vocabulary;
        }

        public async Task<bool> RemoveVocabularyFromList(Guid listId, Guid vocabularyId)
        {
            var vocList = await _toeicDbContext.VocList
                .Include(v => v.Vocabularies)
                .FirstOrDefaultAsync(v => v.idVocList == listId);

            if (vocList != null)
            {
                var vocItem = vocList.Vocabularies.FirstOrDefault(v => v.idVoc == vocabularyId);
                if (vocItem != null)
                {
                    vocList.Vocabularies.Remove(vocItem);
                    vocList.quantity = vocList.Vocabularies.Count;
                    _toeicDbContext.Update(vocList);
                    var deleted = await DeleteVocabulary(vocItem.idVoc);
                    if (deleted)
                    {
                        _uow.SaveChanges();
                        return true;
                    }                    
                }
            }
            return false;
        }

        public async Task<bool> UpdateVocabulary(VocabularyModel model, Guid vocId)
        {
            try
            {
                var voc = _mapper.Map<Vocabulary>(model);
                voc.idVoc = vocId;
                Entities.Update(voc);
                _uow.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
