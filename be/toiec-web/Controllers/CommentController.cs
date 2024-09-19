using Microsoft.AspNetCore.Mvc;
using toeic_web.Controllers;
using toeic_web.ViewModels.Course;
using toiec_web.Services.IService;
using toiec_web.ViewModels.Comment;

namespace toiec_web.Controllers
{
    public class CommentController : BaseAPIController
    {
        private readonly ICommentService _commentService;
        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        [Route("GetFalseComment")]
        public async Task<IActionResult> GetFalseComment()
        {
            var response = await _commentService.GetCommentFalseCheck();
            if (response == null)
            {
                return NotFound(StatusCodes.Status404NotFound);
            }
            return Ok(response);
        }

        [HttpGet]
        [Route("GetComment")]
        public async Task<IActionResult> GetComment(Guid idLesson)
        {
            var response = await _commentService.GetCommentByLesson(idLesson);
            if (response == null)
            {
                return NotFound(StatusCodes.Status404NotFound);
            }
            return Ok(response);
        }

        [HttpPost]
        [Route("AddComment")]
        public async Task<IActionResult> AddComment(CommentAddModel model)
        {
            var response = await _commentService.AddComment(model);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return BadRequest("An issue when add comment.");
        }

        [HttpPut]
        [Route("UpdateComment")]
        public async Task<IActionResult> UpdateComment(CommentUpdateModel model, Guid idComment)
        {
            var response = await _commentService.UpdateComment(model, idComment);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return BadRequest("An issue when update comment.");
        }

        [HttpDelete]
        [Route("DeleteComment")]
        public async Task<IActionResult> DeleteComment(Guid idComment, string idUser)
        {
            var response = await _commentService.DeleteComment(idComment, idUser);
            if (response == true)
            {
                return Ok(response);
            }
            else
                return BadRequest("An issue when delete comment.");
        }
    }
}
