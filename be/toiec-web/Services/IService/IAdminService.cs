namespace toeic_web.Services.IService
{
    public interface IAdminService
    {
        public Task<bool> AddAdmin(string userId);
    }
}
