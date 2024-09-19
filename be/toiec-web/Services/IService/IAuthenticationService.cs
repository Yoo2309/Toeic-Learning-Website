namespace toeic_web.Services.IService
{
    public interface IAuthenticationService
    {
        Task<string> GetCurrentUserId(string username);
        Task<string> GetCurrentUserRole(string username);
        Task<bool> CreateStudent(string studentId);
    }
}
