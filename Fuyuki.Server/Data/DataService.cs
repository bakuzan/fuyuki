using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Fuyuki.Data
{
    public abstract class DataService : IDataService
    {
        private readonly DatabaseContext _context;

        public DataService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<TEntity> GetAsync<TEntity>(int id) where TEntity : BaseEntity<TEntity>
        {
            var entity = await _context.Set<TEntity>().FindAsync(id);

            if (entity == null)
                throw new Exception($"Entity with Id {id} was not found.");

            return entity;
        }

        public async Task<TEntity> GetAsync<TEntity>(int id, params Expression<Func<TEntity, object>>[] includes) where TEntity : BaseEntity<TEntity>
        {
            var query = _context.Set<TEntity>().AsQueryable();

            foreach (var expression in includes)
            {
                query = query.Include(expression);
            }

            return await query.FirstOrDefaultAsync(e => e.Id == id);
        }


        public List<TEntity> Get<TEntity>(List<int> entityIds) where TEntity : BaseEntity<TEntity>
        {
            return _context.Set<TEntity>().Where(x => entityIds.Contains(x.Id)).ToList();
        }

        public async Task<List<TEntity>> GetAsync<TEntity>(List<int> entityIds) where TEntity : BaseEntity<TEntity>
        {
            return await _context.Set<TEntity>().Where(x => entityIds.Contains(x.Id)).ToListAsync();
        }

        public async Task<TEntity> GetAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseEntity<TEntity>
        {
            return await _context.Set<TEntity>().FirstAsync(predicate);
        }

        public async Task<TEntity> GetAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includes) where TEntity : BaseEntity<TEntity>
        {
            var query = _context.Set<TEntity>().Where(predicate).AsQueryable();

            foreach (var expression in includes)
            {
                query = query.Include(expression);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<List<TEntity>> GetListAsync<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : BaseEntity<TEntity>
        {
            return await _context.Set<TEntity>().Where(predicate).ToListAsync();
        }

        public async Task<List<TEntity>> GetListAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includes) where TEntity : BaseEntity<TEntity>
        {
            var query = _context.Set<TEntity>().Where(predicate).AsQueryable();

            foreach (var expression in includes)
            {
                query = query.Include(expression);
            }

            return await query.ToListAsync();
        }

        public async Task<List<TEntity>> GetAllAsync<TEntity>() where TEntity : BaseEntity<TEntity>
        {
            return await _context.Set<TEntity>().ToListAsync();
        }

        public void SetToPersist<TEntity>(TEntity entity) where TEntity : BaseEntity<TEntity>
        {
            if (entity.Id == default(int))
            {
                AddEntity(entity);
            }
            else
            {
                UpdateEntity(entity);
            }
        }

        public void Delete<TEntity>(TEntity entity) where TEntity : BaseEntity<TEntity>
        {
            _context.Set<TEntity>().Remove(entity);
        }


        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        #region Private methods

        private void AddEntity<TEntity>(TEntity entity) where TEntity : BaseEntity<TEntity>
        {
            _context.Entry(entity).State = EntityState.Added;
        }

        private void UpdateEntity<TEntity>(TEntity entity) where TEntity : BaseEntity<TEntity>
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        #endregion
    }
}