namespace toiec_web.ViewModels.Comment
{
    public class CommentViewModel
    {
        public FirstCommentViewModel FirstComment { get; set; }
        public IEnumerable<FirstCommentViewModel> SecondComments { get; set; }
    }
}
