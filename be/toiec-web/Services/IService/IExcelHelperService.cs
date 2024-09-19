namespace toiec_web.Services.IService
{
    public interface IExcelHelperService
    {
        Task<byte[]> CreateFile<T>(List<T> source);
        Task<List<T>> Import<T>(string filePath) where T : new();
    }
}
