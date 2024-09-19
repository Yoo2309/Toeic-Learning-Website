using toiec_web.Models;
using toiec_web.ViewModels.Comment;

namespace toiec_web.Services.IService
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentModel>> GetCommentFalseCheck();
        Task<IEnumerable<CommentViewModel>> GetCommentByLesson(Guid idLesson);
        Task<bool> AddComment(CommentAddModel model);
        Task<bool> UpdateComment(CommentUpdateModel model, Guid idComment);
        Task<bool> DeleteComment(Guid idComment, string idUser);
    }
}
