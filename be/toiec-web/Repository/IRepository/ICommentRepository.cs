using toiec_web.Models;

namespace toiec_web.Repository.IRepository
{
    public interface ICommentRepository
    {
        Task<IEnumerable<CommentModel>> GetCommentFalseCheck();
        Task<IEnumerable<CommentModel>> GetCommentFirst(Guid idLesson);
        Task<IEnumerable<CommentModel>> GetCommentSecond(Guid idComment);
        Task<CommentModel> GetCommentById(Guid idComment);
        Task<bool> AddComment(CommentModel model);
        Task<bool> UpdateComment(CommentModel model, Guid idComment);
        Task<bool> UpdateReportComment(CommentModel model, Guid idComment, bool isDeleted);
        Task<bool> DeleteComment(Guid idComment, string idUser);
    }
}
