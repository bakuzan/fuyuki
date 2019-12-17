using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Fuyuki.Data
{
    public interface IDataService
    {
        Task<TEntity> GetAsync<TEntity>(int id) where TEntity : BaseEntity<TEntity>;
        Task<TEntity> GetAsync<TEntity>(int id, params Expression<Func<TEntity, object>>[] includes) where TEntity : BaseEntity<TEntity>;
        Task<List<TEntity>> GetAsync<TEntity>(List<int> entityIds) where TEntity : BaseEntity<TEntity>;
        Task<TEntity> GetAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseEntity<TEntity>;
        Task<TEntity> GetAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includes) where TEntity : BaseEntity<TEntity>;
        Task<List<TEntity>> GetListAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseEntity<TEntity>;
        Task<List<TEntity>> GetListAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includes) where TEntity : BaseEntity<TEntity>;
        void SetToPersist<TEntity>(TEntity entity) where TEntity : BaseEntity<TEntity>;
        void Delete<TEntity>(TEntity entity) where TEntity : BaseEntity<TEntity>;

        Task SaveAsync();
    }
}