namespace toeic_web.Infrastructure
{
    public interface IUnitOfWork : IDisposable
    {
        void CommitTransaction();
        void RollbackTransaction();
        int SaveChanges();
        void BeginTransaction();
    }
}
