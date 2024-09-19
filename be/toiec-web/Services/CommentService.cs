using AutoMapper;
using Microsoft.AspNetCore.Identity;
using toeic_web.Models;
using toeic_web.Repository.IRepository;
using toiec_web.Models;
using toiec_web.Repository.IRepository;
using toiec_web.Services.IService;
using toiec_web.ViewModels.Comment;

namespace toiec_web.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly UserManager<Users> _userManager;
        private readonly IMapper _mapper;
        public CommentService(ICommentRepository commentRepository, IMapper mapper,
            UserManager<Users> userManager)
        {
            _commentRepository = commentRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        public Task<bool> AddComment(CommentAddModel model)
        {
            try
            {
                var data = _mapper.Map<CommentModel>(model);
                return _commentRepository.AddComment(data);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Task<bool> DeleteComment(Guid idComment, string idUser)
        {
            try
            {
                return _commentRepository.DeleteComment(idComment, idUser);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<CommentViewModel>> GetCommentByLesson(Guid idLesson)
        {
            try
            {
                var listComment = new List<CommentViewModel>();           

                var listFirstCmtData =await _commentRepository.GetCommentFirst(idLesson);
                if (listFirstCmtData != null)
                {
                    foreach (var firstComment in listFirstCmtData)
                    {
                        var listSecondCmtData =await _commentRepository.GetCommentSecond(firstComment.idComment);
                        var comment = new CommentViewModel();
                        var listSecondComment = new List<FirstCommentViewModel>();

                        if (listSecondCmtData != null)
                        {
                            foreach (var secondComment in listSecondCmtData)
                            {
                                var secondCmt = _mapper.Map<FirstCommentViewModel>(secondComment);
                                var secondUserInfo = await _userManager.FindByIdAsync(secondCmt.idUser);

                                secondCmt.username = secondUserInfo.UserName;
                                secondCmt.imageURL = secondUserInfo.ImageURL;

                                listSecondComment.Add(secondCmt);
                            }
                        } 

                        //firstComment
                        var firstUserInfo = await _userManager.FindByIdAsync(firstComment.idUser);
                        var firstCmtModel = _mapper.Map<FirstCommentViewModel>(firstComment);
                        firstCmtModel.username = firstUserInfo.UserName;
                        firstCmtModel.imageURL = firstUserInfo.ImageURL;

                        comment.FirstComment = firstCmtModel;
                        comment.SecondComments = listSecondComment;
                        listComment.Add(comment);
                    }
                }
                return listComment;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<CommentModel>> GetCommentFalseCheck()
        {
            var data = await _commentRepository.GetCommentFalseCheck();
            var listData = new List<CommentModel>();
            if (data != null)
            {
                foreach (var comment in data)
                {
                    var obj = _mapper.Map<CommentModel>(comment);
                    listData.Add(obj);
                }
            }
            return listData;
        }

        public Task<bool> UpdateComment(CommentUpdateModel model, Guid idComment)
        {
            try
            {
                var data = _mapper.Map<CommentModel>(model);
                return _commentRepository.UpdateComment(data, idComment);   
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
