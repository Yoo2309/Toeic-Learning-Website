using Microsoft.EntityFrameworkCore.Storage;
using toeic_web.Models;

namespace toeic_web.Infrastructure
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly ToeicDbContext _dbContext;
        private IDbContextTransaction? _transaction = null;

        public UnitOfWork(ToeicDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public int SaveChanges()
        {
            return _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
            GC.SuppressFinalize(this);
        }

        public void BeginTransaction()
        {
            _transaction = _dbContext.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            if (_transaction != null)
            {
                _transaction.Commit();
                _transaction.Dispose();
            }
        }

        public void RollbackTransaction()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                _transaction.Dispose();
            }
        }
    }
}

