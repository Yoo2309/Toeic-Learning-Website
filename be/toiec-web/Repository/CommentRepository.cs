using AutoMapper;
using Microsoft.EntityFrameworkCore;
using toeic_web.Infrastructure;
using toeic_web.Models;
using toiec_web.Models;
using toiec_web.Repository.IRepository;

namespace toiec_web.Repository
{
    public class CommentRepository : Repository<Comment>, ICommentRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public CommentRepository(ToeicDbContext dbContext, IUnitOfWork uow, IMapper mapper) 
            : base(dbContext)
        {
            _uow = uow;
            _mapper = mapper;
        }
        public Task<bool> AddComment(CommentModel model)
        {
            try
            {
                var cmt = _mapper.Map<Comment>(model);
                cmt.idComment = new Guid();
                Entities.Add(cmt);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteComment(Guid idComment, string idUser)
        {
            try
            {
                var cmt = GetById(idComment);
                if (cmt == null)
                {
                    throw new ArgumentNullException(nameof(cmt));
                }

                if (cmt.idUser == idUser)
                {
                    var listSecondCmt = await GetCommentSecond(idComment);
                    if (listSecondCmt != null)
                    {
                        foreach (var secondCmt in listSecondCmt)
                        {
                            var obj = GetById(secondCmt.idComment);
                            Entities.Remove(obj);
                        }
                    }
                    Entities.Remove(cmt);
                    _uow.SaveChanges();
                    return await Task.FromResult(true);
                } 
                return await Task.FromResult(false);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CommentModel> GetCommentById(Guid idComment)
        {
            try
            {
                IAsyncEnumerable<Comment> cmts = Entities.AsAsyncEnumerable();
                await foreach (var cmt in cmts)
                {
                    if (cmt.idComment == idComment)
                    {
                        var data = _mapper.Map<CommentModel>(cmt);
                        return data;
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<CommentModel>> GetCommentFalseCheck()
        {
            try
            {
                var listData = new List<CommentModel>();
                var data = await Entities.OrderBy(ls => ls.createdDate).ToListAsync();
                foreach (var comment in data)
                {
                    if (comment.isDeleted == false)
                    {
                        var obj = _mapper.Map<CommentModel>(comment);
                        listData.Add(obj);
                    }
                }
                return listData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<CommentModel>> GetCommentFirst(Guid idLesson)
        {
            try
            {
                var listData = new List<CommentModel>();
                var data = await Entities.OrderBy(ls => ls.createdDate).ToListAsync();
                foreach (var comment in data)
                {
                    if (comment.idLesson == idLesson && comment.idCommentReply == null && comment.isDeleted == false)
                    {
                        var obj = _mapper.Map<CommentModel>(comment);
                        listData.Add(obj);
                    }
                }
                return listData;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<CommentModel>> GetCommentSecond(Guid idComment)
        {
            try
            {
                var listData = new List<CommentModel>();
                var data = await Entities.Where(comment => comment.idCommentReply == idComment && comment.isDeleted == false)
                                          .OrderBy(comment => comment.createdDate)
                                          .ToListAsync();
                foreach (var comment in data)
                {
                    var obj = _mapper.Map<CommentModel>(comment);
                    listData.Add(obj);
                }
                // Check và thêm các bình luận tiếp theo mà idCommentReply của chúng trùng với idComment của các bình luận trong listData
                bool addedNewComments;
                do
                {
                    addedNewComments = false; // Đặt cờ đã thêm mới bình luận thành false
                    foreach (var commentModel in listData.ToList()) // Duyệt qua một bản sao của listData để tránh lỗi khi thay đổi danh sách trong quá trình lặp
                    {
                        var newComments = await Entities.Where(comment => comment.idCommentReply == commentModel.idComment) // Lấy ra các bình luận mới có idCommentReply trùng với idComment của bình luận hiện tại trong listData
                                                        .OrderBy(comment => comment.createdDate)
                                                        .ToListAsync();

                        foreach (var newComment in newComments)
                        {
                            var newObj = _mapper.Map<CommentModel>(newComment);
                            if (!listData.Any(cm => cm.idComment == newObj.idComment)) // Kiểm tra xem bình luận đã tồn tại trong listData chưa
                            {
                                listData.Add(newObj);
                                addedNewComments = true; // Đánh dấu rằng đã thêm mới bình luận
                            }
                        }
                    }
                } while (addedNewComments); // Lặp lại cho đến khi không có bình luận mới được thêm vào nữa

                return listData;
            }
            catch (Exception ex)
            {
                // Ghi nhật ký hoặc xử lý ngoại lệ một cách cẩn thận
                throw new Exception("An error occurred while fetching comments.", ex);
            }
        }

        public Task<bool> UpdateComment(CommentModel model, Guid idComment)
        {
            try
            {
                var cmt = _mapper.Map<Comment>(model);
                cmt.idComment = idComment;
                Entities.Update(cmt);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public Task<bool> UpdateReportComment(CommentModel model, Guid idComment, bool isDeleted)
        {
            try
            {
                var cmt = _mapper.Map<Comment>(model);
                cmt.idComment = idComment;
                cmt.isDeleted = isDeleted;
                Entities.Update(cmt);
                _uow.SaveChanges();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
